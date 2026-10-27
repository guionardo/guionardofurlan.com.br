---
title: 'Crear GIF animados desde la terminal'
description: 'Cómo grabar una sesión de terminal con asciinema y renderizarla como un GIF animado usando agg.'
date: 2022-08-19
slug: gifs-animados-desde-la-terminal
tags: [terminal, gif, linux]
draft: false
lang: es
translationKey: terminal-animated-gifs
---

## El problema

Necesitaba crear vídeos cortos para demostrar aplicaciones de consola. La captura de pantalla tradicional es incómoda y suele producir archivos más grandes de lo necesario para este tipo de ejemplo.

Este texto es una actualización revisada del artículo original [Creating animated gifs from your terminal](https://dev.to/guionardo/creating-animated-gifs-from-your-terminal-3oo5), publicado en 2022. Los comandos se comprobaron con la documentación actual de `asciinema` y `agg`.

El artículo original también usaba este pato danzante como demostración visual. El GIF pertenece a un tercero y se incluye con atribución a la [colección de GIFs de patos danzantes de USAGIF](https://usagif.com/dancing-duck-gifs-shuba-duck-and-others/):

![GIF de un pato danzando](/images/gifs-animados-do-terminal/dancing-duck.gif)

## El flujo

El proceso tiene dos pasos:

1. grabar la sesión de terminal en un archivo `.cast` con `asciinema`;
2. renderizar la grabación como GIF con `agg`.

El archivo `.cast` registra eventos de terminal en lugar de capturar cada píxel de la pantalla. Esto suele producir una grabación ligera y permite elegir después la fuente, el tema y el tamaño durante el renderizado.

## Instalar asciinema

`asciinema` está disponible en los repositorios de Debian y Ubuntu:

```bash
sudo apt update
sudo apt install asciinema
```

También hay binarios oficiales y otras opciones de instalación en la [documentación de asciinema](https://docs.asciinema.org/manual/cli/).

Comprueba la instalación:

```bash
asciinema --version
```

## Grabar una sesión

Inicia una grabación en un archivo local:

```bash
asciinema rec first.cast
```

Ejecuta normalmente los comandos que quieras demostrar. Para terminar, pulsa `Ctrl+D` o ejecuta `exit`.

Revisa la grabación antes de compartirla. Todo lo que aparezca en la terminal puede quedar capturado, incluidas contraseñas escritas, tokens, rutas privadas, nombres de host y datos de configuración.

## Instalar agg

`agg` es el generador de GIF del proyecto asciinema. La opción más sencilla es descargar un binario compatible desde la [página de releases de agg](https://github.com/asciinema/agg/releases), hacerlo ejecutable y colocarlo en un directorio incluido en `PATH`.

Si ya usas Rust, puedes compilar e instalar la versión actual directamente desde el repositorio:

```bash
cargo install --git https://github.com/asciinema/agg
```

Este camino requiere una versión de Rust y Cargo compatible con la versión actual del proyecto. Después, compruébala:

```bash
agg --version
```

El proyecto también publica una imagen OCI oficial para Docker o Podman. Es útil si no quieres instalar el toolchain de Rust en el host; hay ejemplos en la [documentación de instalación de agg](https://docs.asciinema.org/manual/agg/installation/).

## Generar el GIF

Con `first.cast` y `agg` disponibles en `PATH`:

```bash
agg first.cast first.gif
```

Este es un ejemplo de un GIF renderizado a partir de una sesión grabada:

![GIF animado de una sesión de terminal renderizada con agg](/images/gifs-animados-do-terminal/first.gif)

Para elegir una fuente instalada y un directorio adicional de fuentes:

```bash
agg --font-dir ./fonts --font-family 'JetBrains Mono' first.cast first.gif
```

Las versiones actuales de `agg` también permiten elegir temas, cambiar el tamaño de la fuente, ajustar la velocidad y renderizar solo una parte de la grabación. Consulta `agg --help` o la [documentación de uso de agg](https://docs.asciinema.org/manual/agg/usage/) para esas opciones.

También puedes convertir directamente una grabación publicada desde una URL:

```bash
agg https://asciinema.org/a/569727 demo.gif
```

## Conservar el archivo cast

El archivo de grabación sigue siendo una fuente editable y reproducible. Conserva el `.cast` junto al proyecto si quieres regenerar el GIF con otra fuente, tema o velocidad.

Para una demostración pública, sin embargo, el flujo más sencillo es compartir el GIF generado o la grabación de asciinema, según el objetivo del material.

## Límites del formato

GIF es conveniente para incrustar en páginas e issues, pero no es un formato eficiente para vídeos largos. Su paleta de colores es limitada y el archivo puede crecer bastante cuando la sesión tiene muchos cambios visuales.

Para grabaciones largas o contenido con audio, un formato de vídeo tradicional puede ser más apropiado. Para ejemplos cortos de comandos, el par `.cast` + GIF suele ser suficiente.
