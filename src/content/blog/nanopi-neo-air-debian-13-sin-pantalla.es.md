---
title: 'NanoPi NEO Air con Debian 13 — de la eMMC al primer acceso por SSH'
description: 'Instala Debian 13 en la eMMC de la NanoPi NEO Air, configura Wi-Fi y SSH antes del primer arranque y guarda la microSD para recuperar el sistema.'
date: 2026-11-15
slug: nanopi-neo-air-debian-13-sin-pantalla
tags: [nanopi, allwinner-h3, debian, emmc, linux, sistemas-embebidos, wifi]
draft: false
lang: es
translationKey: nanopi-neo-air-host-headless
---

## Una tarjeta para instalar y recuperar el sistema

La primera vez que encendí la NanoPi NEO Air, el sistema de la memoria interna se reiniciaba en bucle. La placa no tiene HDMI ni puerto Ethernet, y mi adaptador serie perdía la conexión a mitad del arranque. Para averiguar qué pasaba, primero necesitaba un sistema al que pudiera conectarme.

Preparé una tarjeta microSD que arrancaba con los ajustes de mi red Wi-Fi y mi clave SSH. Desde ese sistema pude grabar la eMMC, montarla y configurar Debian antes de su primer arranque. Después saqué la tarjeta, encendí la placa y entré por SSH. Guardé la tarjeta por si necesitaba reparar la instalación.

Este tutorial sigue el procedimiento que probé con una **NanoPi NEO Air de 8 GB**, **Debian 13 (trixie)** y el kernel **4.14.111** de la imagen de FriendlyElec. Todo se hace desde un equipo Linux y a través de la red local.

[Consulta la foto de la placa en la wiki de FriendlyElec](https://wiki.friendlyelec.com/wiki/index.php/File:NanoPi_NEO-AIR-1.jpg).

## 1. Reúne el material y descarga la imagen

- NanoPi NEO Air con la antena Wi-Fi conectada y una fuente microUSB de 5 V / 2 A.
- Equipo Linux con Git, Bash y lector de tarjetas microSD.
- Tarjeta microSD de al menos 16 GB. La imagen ocupa unos 14 GiB al descomprimirla.
- Red Wi-Fi de 2,4 GHz con WPA2 y DHCP. El equipo debe poder conectarse a la placa a través de esa red.

En la sección **01_Official images** de FriendlyElec, busca `h3-eflasher-debian-trixie-core-4.14-armhf-20260330.img.gz`. La variante **eflasher** contiene el sistema que se grabará en la eMMC. Mantén el archivo comprimido. [Wiki de la NanoPi NEO Air y enlace a las descargas](https://wiki.friendlyelec.com/wiki/index.php/NanoPi_NEO_Air#Downloads)

**La instalación borra la tarjeta microSD y sobrescribe el contenido de la eMMC.** Antes de empezar, haz una copia de lo que quieras conservar de ambos dispositivos.

## 2. Prepara la tarjeta microSD en el equipo

Clona el repositorio y coloca la imagen descargada en su carpeta `images/`.

```bash
git clone https://github.com/guionardo/nanopi-neo-air.git
cd nanopi-neo-air
mkdir -p images
```

Ejecuta el siguiente comando antes y después de conectar el lector con la tarjeta insertada. Identifica el dispositivo completo por su tamaño, modelo y la nueva entrada de la lista. Si la tarjeta aparece como `/dev/sdb`, por ejemplo, `/dev/sdb1` es una de sus particiones.

```bash
lsblk -p -o NAME,SIZE,MODEL,TYPE,MOUNTPOINTS
```

Define estos valores en la terminal. **Sustituye `/dev/sdb` por el dispositivo que acabas de identificar.** La suma SHA-256 corresponde al archivo exacto que usé en esta instalación.

```bash
export SD_DEV=/dev/sdb
export IMAGE="$PWD/images/h3-eflasher-debian-trixie-core-4.14-armhf-20260330.img.gz"
export IMAGE_SHA256=7e2943e4ae401693cd560d5cb9186f2e3984b886613eeb4c66bc75d3749c2fd1
export HOSTNAME_NEW=nanopi
./install.sh check
```

Escribe el SSID respetando las mayúsculas y minúsculas que muestra el router. Introduce la contraseña cuando el instalador la solicite. Se guarda en `install.conf`, con permisos `600` y fuera de Git. Si faltan herramientas, el script puede intentar instalarlas con el gestor de paquetes. Usa `--skip-deps` si prefieres gestionar las dependencias manualmente.

Una vez completada la comprobación, ejecuta en la misma terminal:

```bash
./install.sh card
```

El script usa `sudo` para grabar la tarjeta y te pide que escribas la ruta del dispositivo para confirmar. Instala en la tarjeta el firmware de Wi-Fi, el perfil de tu red y la clave pública SSH. Usa `~/.ssh/id_ed25519` de forma predeterminada y genera el par de claves si todavía no existe. Para usar otra clave, define `SSH_KEY` con la ruta de la clave privada antes de ejecutar el instalador.

## 3. Graba la eMMC y configura Debian desde la tarjeta

1. Con la placa apagada, inserta la tarjeta microSD y conecta la fuente. El primer arranque desde la tarjeta graba la eMMC automáticamente. Reserva unos 15 minutos y espera a que la placa se apague sola. Grabar la tarjeta en el equipo fue un paso anterior y tardó unos 22 minutos en mi banco de pruebas.
2. Enciende la placa de nuevo **con la tarjeta todavía insertada**. Consulta la lista de clientes DHCP del router para averiguar la IP de la placa. El proceso de grabación se desactiva antes de escribir y la tarjeta queda disponible para tareas de mantenimiento.
3. En el equipo, asigna a `BOARD_IP` en `install.conf` la dirección que recibió el sistema de la tarjeta, por ejemplo `BOARD_IP=192.168.1.50`. Ejecuta el siguiente comando para comprobar la grabación y configurar el sistema de la eMMC.

```bash
./install.sh net
```

Busca el mensaje `eMMC gravada e verificada (verify=ok)` en la terminal. El instalador toma esa confirmación de la entrada `FLASH_DONE verify=ok` en `/root/flash-emmc.log`, en la tarjeta. Si falta la confirmación o aparece un error de escritura, consulta el registro antes de continuar.

Mientras el sistema de la tarjeta está en marcha, el instalador monta la eMMC y configura el nombre del equipo, el firmware, la red y el acceso SSH. En este paso también copia la clave pública a la eMMC. Al instalarla, configura el servidor SSH de la eMMC para rechazar la autenticación por contraseña. Al final, apaga la placa.

## 4. Retira la tarjeta y comprueba el acceso por SSH

Con la placa apagada, retira la tarjeta microSD y conecta la fuente. El sistema de la eMMC puede recibir otra IP. Consulta el router de nuevo, actualiza `BOARD_IP` en `install.conf` y usa esa misma dirección en el comando SSH. Si elegiste otra clave, ajusta también el argumento `-i`.

```bash
./install.sh verify
ssh -i ~/.ssh/id_ed25519 root@192.168.1.51
```

En mi banco de pruebas, la verificación mostró la raíz en `overlay`, el arranque desde la eMMC, la conexión Wi-Fi asociada y ninguna unidad de systemd con errores. La raíz en `overlay` es normal en esta imagen. Debian combina una partición base con una capa de escritura en `userdata`. La eMMC apareció como `mmcblk0` al arrancar sin tarjeta y como `mmcblk1` al arrancar desde la microSD. Comprueba los dispositivos con `lsblk` antes de montar una partición a mano.

## La interfaz Wi-Fi aparecía antes de que funcionara la radio

Al principio todo parecía ir bien. Linux mostraba `wlan0`. Sin embargo, `wpa_supplicant` registraba `Failed to initiate sched scan` y la placa nunca llegaba a asociarse al router. El error de DHCP que aparecía después era una consecuencia de esa falta de asociación.

El AP6212 usa el chip BCM43430, y el controlador `brcmfmac` carga dos archivos: el firmware `brcmfmac43430-sdio.bin` y el archivo NVRAM `brcmfmac43430-sdio.txt`. El archivo de texto contiene parámetros de calibración del módulo. El que estaba instalado correspondía a otro módulo con el mismo chip. Entre las diferencias, el archivo del AP6212 tenía `xtalfreq=26000`, mientras que el otro usaba `37400`.

Sustituí el archivo entero por el NVRAM del AP6212 y la radio volvió a detectar redes. Después corregí la escritura del SSID para completar la asociación. Por eso el instalador coloca los mismos dos archivos de firmware en la tarjeta y en la eMMC. [Origen de los archivos y detalles de calibración](https://github.com/guionardo/nanopi-neo-air/tree/main/firmware)

## Si la placa no aparece en la red

| Síntoma | Qué comprobar |
| --- | --- |
| La tarjeta no supera la comprobación inicial | Comprueba el dispositivo en `lsblk`, la capacidad de la tarjeta y si el SHA-256 corresponde a la imagen elegida. |
| La tarjeta arranca, pero la placa no recibe una IP | Comprueba la antena, el SSID, la contraseña y la banda de 2,4 GHz. El instalador necesita la IP del sistema de la tarjeta para configurar la placa por SSH. |
| La tarjeta responde, pero la grabación no está confirmada | Consulta `/root/flash-emmc.log` mientras estás conectado al sistema de la tarjeta. Si falló la grabación, investiga la causa antes de preparar otro intento. |
| SSH funciona desde la tarjeta, pero falla desde la eMMC | Busca primero la nueva IP en el router. Si sigues sin acceso, apaga la placa, vuelve a insertar la tarjeta que ya usaste y conéctate a ella por SSH para examinar el sistema de la eMMC. |

Guarda la tarjeta microSD después de la instalación. Ya contiene la configuración de red y tu clave pública, así que puedes volver a arrancar desde ella y montar la eMMC para recuperar el acceso. Para diagnosticar la instalación que hay en la placa, reutiliza la tarjeta tal cual. Ejecutar de nuevo `./install.sh card` vuelve a activar la grabación para el siguiente arranque.

La última prueba fue sencilla. Reinicié la placa sin la tarjeta microSD y entré con la misma clave. A partir de ahí tenía dos formas de acceder al sistema: SSH directo a la eMMC para el día a día y SSH desde la tarjeta para recuperar la instalación.

[Documentación del instalador](https://github.com/guionardo/nanopi-neo-air/blob/main/docs/15-instalador.md) · [Registro de la instalación de Debian 13](https://github.com/guionardo/nanopi-neo-air/blob/main/docs/12-log-de-bordo.md#sessão-15--2026-11-15--trixie-na-emmc-gravar-provisionar-e-verificar)
