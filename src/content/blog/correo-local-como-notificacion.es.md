---
title: 'Usar el correo local como herramienta de notificación'
description: 'Cómo usar el buzón local de Linux para conservar notificaciones de cron y scripts sin depender de una interfaz gráfica.'
date: 2022-05-04
slug: correo-local-como-notificacion
tags: [linux, terminal, notificaciones]
draft: true
lang: es
translationKey: local-mail-notifications
---

## El problema

Ejecuto comandos y desarrollo en la terminal de Linux, además de mantener tareas programadas en segundo plano. No siempre necesito una notificación gráfica; muchas veces solo quiero saber que un proceso terminó o que una tarea encontró un error.

Una alternativa sencilla es usar el buzón de correo local del propio sistema como repositorio de esos mensajes.

Este texto es una actualización revisada del artículo original [Using local mail as notification tool](https://dev.to/guionardo/using-local-mail-as-notification-tool-47k2), publicado en 2022. Los ejemplos se compararon con una configuración real en Debian 13.

## Qué sigue siendo válido

Cuando un job de cron produce salida y no define `MAILTO` con un valor vacío, cron puede enviar esa salida al propietario del crontab o al destinatario configurado en `MAILTO`.

Esto es diferente de enviar mensajes por Internet. En este caso, Postfix entrega el mensaje localmente, en un buzón mbox como `/var/mail/<usuario>`, y Mutt funciona como lector de correo en la terminal.

Esta guía fue validada en Debian 13. El mismo modelo también se aplica a Ubuntu, pero los nombres de los paquetes y las opciones del comando `mail` pueden variar entre distribuciones.

## Instalación

En el entorno de referencia uso `bsd-mailx` para enviar mensajes, Postfix como MTA local y Mutt para leer el buzón:

```bash
sudo apt update
sudo apt install postfix bsd-mailx mutt
```

Durante la configuración de Postfix, elige el modo local cuando esté disponible. El objetivo es aceptar y entregar mensajes en el propio host, no convertir la máquina en un servidor de correo público.

Comprueba qué comandos están disponibles:

```bash
command -v mail mailx mutt
```

Las distintas implementaciones de `mail` y `mailx` no aceptan exactamente las mismas opciones. El ejemplo siguiente usa la forma corta `-s`, compatible con el `bsd-mailx` instalado en el servidor.

En Debian 13, Mutt puede usar `/var/tmp` para sus archivos temporales. Si ese directorio está restringido a `root`, Mutt puede abrir el buzón, pero falla al mostrar un mensaje con `No se pudo crear un archivo temporal`. En ese caso, usa un directorio temporal en el que el usuario pueda escribir:

```bash
export TMPDIR=/tmp
mutt -D | grep '^tmpdir='
```

El comando debe mostrar `tmpdir="/tmp"`. Para hacer la configuración permanente solo para el usuario actual, también puedes añadir `set tmpdir="/tmp"` a `~/.muttrc`.

## Probar el buzón local

Envía un mensaje al usuario actual:

```bash
printf '%s\n' 'This is a test' | mail -s 'Test email' "$USER@localhost"
```

Después, abre el lector:

```bash
mutt
```

## Mostrar mensajes no leídos en el prompt

En Bash, un pequeño hook puede consultar el buzón periódicamente y mostrar un aviso en el prompt. Este ejemplo usa la salida de `bsd-mailx`, que marca los mensajes nuevos o no leídos con `N` o `U`:

```bash
MAIL_CHECK_TIME=0

mail_prompt() {
    local mail_interval=${MAILCHECK:-60}
    local elapsed=$((SECONDS - MAIL_CHECK_TIME))

    if [[ "$MAIL_CHECK_TIME" -eq 0 || "$elapsed" -gt "$mail_interval" ]]; then
        local count
        count=$(printf 'q\n' | mail -u "$USER" 2>/dev/null \
            | awk '/^[[:space:]]*[NU][[:space:]]+[0-9]+/ { count++ } END { print count + 0 }')

        if [[ "$count" -gt 0 ]]; then
            local word='message'
            [[ "$count" -gt 1 ]] && word='messages'
            echo "$count unread $word. Run mutt"
        fi

        MAIL_CHECK_TIME=$SECONDS
    fi
}

if command -v mail >/dev/null 2>&1; then
    PROMPT_COMMAND="mail_prompt${PROMPT_COMMAND:+;$PROMPT_COMMAND}"
fi
```

Guarda el fragmento, por ejemplo, en `~/.mail_prompt`, y cárgalo desde `~/.bashrc`:

```bash
source "$HOME/.mail_prompt"
```

Este contador está deliberadamente limitado a `bsd-mailx` y Bash. Otras implementaciones de `mail` pueden formatear los headers de otra manera; en ese caso, hay que probar de nuevo la regla de `awk`.

Postfix entrega el mensaje en el buzón local, normalmente `/var/mail/$USER`. Puedes confirmar la ruta con:

```bash
postconf mail_spool_directory
```

En el entorno utilizado, el buzón pertenece directamente al usuario, por lo que no es necesario añadirlo al grupo `mail`.

## Usarlo con cron

Un crontab puede enviar la salida de una tarea al buzón local:

```text
MAILTO=guionardo

*/15 * * * * /home/guionardo/bin/check-backups
```

Si el comando escribe en `stdout` o `stderr`, cron reenvía esa salida como mensaje. Para probarlo sin esperar al horario programado:

```bash
/home/guionardo/bin/check-backups
```

Después, abre Mutt y comprueba el nuevo mensaje.

Si una tarea se ejecuta mediante un script propio, también puede enviar un mensaje explícitamente:

```bash
if ! /home/guionardo/bin/check-backups; then
    printf '%s\n' 'La comprobación de copias de seguridad falló.' \
        | mail -s 'Fallo de la copia de seguridad' "$USER@localhost"
fi
```

## Configuración local y seguridad

Para un buzón local, comprueba que Postfix esté limitado al loopback y que la red autorizada contenga únicamente el propio host:

```bash
postconf inet_interfaces mynetworks mydestination relayhost
```

Una configuración local típica usa `loopback-only` en `inet_interfaces`, direcciones de loopback en `mynetworks`, el propio host en `mydestination` y ningún `relayhost` externo.

No copies una configuración completa de servidor de correo para este caso. Un Postfix expuesto o configurado para hacer relay para otras redes puede convertir una herramienta local en un problema de abuso de correo.

## Diagnóstico

Cuando el mensaje no aparece, comprueba:

```bash
postfix check
journalctl -u postfix --since '10 minutes ago'
ls -l /var/mail/"$USER"
mutt -D | grep '^tmpdir='
```

Recuerda también que una tarea silenciosa no genera un mensaje automático de cron. Si no hay salida, usa una llamada explícita a `mail` o registra un mensaje de error.

## Límites de este enfoque

El correo local es útil para notificaciones de una sola máquina: tareas de backup, scripts de mantenimiento y procesos largos. No sustituye un servicio de alertas cuando la máquina puede quedar indisponible, ni ofrece historial centralizado, entrega al móvil o garantía de recepción externa.

Las reglas `MAILTO` de cron están documentadas en el [manual de crontab de Ubuntu](https://manpages.ubuntu.com/manpages/noble/man5/crontab.5.html). La [guía de configuración básica de Postfix](https://www.postfix.org/BASIC_CONFIGURATION_README.html) explica las decisiones de relay y entrega local, y el [manual de GNU Mailutils](https://mailutils.org/manual/html_section/mail.html) documenta otra implementación del comando `mail`.
