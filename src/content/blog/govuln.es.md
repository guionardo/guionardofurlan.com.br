---
title: "GoVuln: análisis de vulnerabilidades en el flujo de desarrollo"
description: "Una introducción al wrapper de govulncheck y su integración con pre-commit para proyectos Go."
date: 2026-09-10
slug: govuln-vulnerabilidades-flujo-desarrollo
tags: [Go, seguridad, automatización]
draft: true
lang: es
translationKey: govuln-fluxo-desenvolvimento
---

Una comprobación de vulnerabilidades necesita un lugar en el trabajo cotidiano.
[GoVuln](https://github.com/guionardo/govuln) aborda esta integración como un
wrapper de `govulncheck`, con recursos para organizar la ejecución y presentar
los resultados.

## Acercar el análisis al commit

El manifiesto de hooks del repositorio define `go-vulncheck`, con `govuln` como
punto de entrada y soporte para las etapas `pre-commit`, `pre-push` y `manual`.
También declara `pass_filenames: false` y `always_run: true`: el hook no recibe
la lista de archivos modificados y está configurado para ejecutarse incluso
sin archivos coincidentes.

Esto sitúa la comprobación como una operación sobre el proyecto. Es diferente
de un formateador que solo recibe los archivos seleccionados para el commit.
La etapa utilizada depende de la configuración de pre-commit del proyecto.

## El papel del wrapper

Según el README, GoVuln añade caché, análisis de dependencias internas y
submódulos, ejecución concurrente e informes en tablas o Markdown. El motor
de análisis sigue siendo `govulncheck`; el propósito del wrapper es organizar
su uso en el flujo de desarrollo.

La caché implica una decisión operativa importante: reutilizar un resultado
reduce el trabajo repetido, pero no equivale a realizar un análisis nuevo.
La documentación describe una duración de 24 horas. Antes de incorporar este
comportamiento a una política de CI, conviene validar la invalidación de la
caché y las condiciones que exigen una ejecución actualizada.

## La documentación también necesita verificación

Durante la revisión del repositorio, los ejemplos del README contenían URLs
con `github.com` duplicado y referencias distintas para el modo de aviso.
El manifiesto consultado declara únicamente el hook `go-vulncheck`.

Por eso, un tutorial reproducible debe fijar una revisión y comprobar sus
comandos y opciones, en lugar de copiar indiscriminadamente ejemplos de
versiones distintas. Este artículo presenta la estructura documentada; no
relata una ejecución de la herramienta ni los resultados de un análisis.

## Próximo experimento

Un paso útil es probar la integración en un proyecto Go controlado, registrando
la versión utilizada, el resultado sin caché, el comportamiento con caché y el
código de salida del hook. Este experimento puede fundamentar la decisión de
dónde ejecutar el análisis y cómo tratar sus resultados.

## Fuentes

- [README de GoVuln](https://github.com/guionardo/govuln/blob/2d6c89d4ce224449925c8c2c023029624e352217/README.md).
- [Manifiesto de hooks](https://github.com/guionardo/govuln/blob/2d6c89d4ce224449925c8c2c023029624e352217/.pre-commit-hooks.yaml).

<!-- Revisión editorial: validar la instalación, las opciones de CLI y el
comportamiento de la caché antes de ampliar el texto a un tutorial. Fijar la
fecha de publicación y revisar PT/EN/ES. No modificar el repositorio externo. -->
