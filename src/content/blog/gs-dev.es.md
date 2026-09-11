---
title: "gs-dev: un asistente para trabajar en la terminal"
description: "Cómo una CLI reúne navegación entre proyectos, información de Git y uso compartido temporal de texto."
date: 2026-09-10
slug: gs-dev-asistente-terminal
tags: [Go, CLI, productividad]
draft: true
lang: es
translationKey: gs-dev-assistente-terminal
---

Cambiar de repositorio implica pequeñas tareas recurrentes: encontrar una carpeta,
abrir el remoto en el navegador o consultar cambios en el historial.
[gs-dev](https://github.com/guionardo/gs-dev) reúne estas operaciones en un
asistente de desarrollo para la terminal.

## Encontrar el proyecto es parte del trabajo

El grupo `dev` organiza el acceso a las carpetas de desarrollo. La referencia
generada de la CLI presenta subcomandos para registrar raíces, sincronizar el
inventario, listar directorios y buscar proyectos:

```bash
gs-dev dev --help
```

El README describe detección mediante archivos de manifiesto para Go, Python,
JavaScript, Rust, Java, PHP y .NET. Esto permite organizar la navegación en torno
a los proyectos, en lugar de depender únicamente de recordar las rutas.

## Una CLI que conversa con el shell

Cambiar el directorio del shell requiere una integración que va más allá de
ejecutar un programa. gs-dev documenta funciones de shell para `dev`, `fav` y
`pad`, y un mecanismo que entrega comandos al shell mediante un archivo temporal.

La instalación de estas funciones modifica el perfil de Bash o Zsh. Conviene
distinguir ese paso de la instalación del binario: disponer del ejecutable e
integrar sus comandos en el entorno son operaciones distintas.

## Git y texto compartido

La herramienta también ofrece estadísticas de commits y acceso a la URL del remoto:

```bash
gs-dev git-stats --help
gs-dev url --just-show
```

Otro componente es el servicio pad por gRPC, destinado a fragmentos de texto
temporales. El README describe expiración configurable y autenticación mediante
clave de API. Es una capacidad separada de la navegación entre directorios y
requiere un servidor pad configurado.

## Qué explorar

gs-dev es un ejemplo de cómo reunir pequeñas tareas en una herramienta coherente.
Un próximo experimento podría comparar la navegación habitual con el flujo asistido
en un conjunto real de repositorios. Este artículo aún no contiene mediciones:
la mejora debe observarse, no darse por supuesta.

## Fuentes

- [README de gs-dev](https://github.com/guionardo/gs-dev/blob/629d4020ceb28abfe276e08dedaa944a50465541/README.md).
- [Referencia del grupo dev](https://github.com/guionardo/gs-dev/blob/629d4020ceb28abfe276e08dedaa944a50465541/docs/gs-dev_dev.md).

<!-- Revisión editorial: no se ejecutaron los comandos durante esta revisión.
Verificar los ejemplos en la versión elegida y fijar la fecha antes de publicar
los tres idiomas. La referencia generada usa `gs-dev dev`; el README contiene
ejemplos abreviados sin ese nivel. -->
