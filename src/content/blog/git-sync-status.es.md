---
title: "git-sync-status: ¿qué significa estar sincronizado?"
description: "Las ramas, los commits y los cambios locales describen dimensiones distintas del estado de un repositorio."
date: "2026-09-11"
slug: "git-sync-status-repositorio-sincronizado-es"
tags: ["Git", "Go", "herramientas"]
draft: true
lang: "es"
translationKey: "git-sync-status-introduction"
---

## Una pregunta con más de una respuesta

Al cambiar entre entornos de desarrollo, decir que un repositorio está
«sincronizado» puede ocultar situaciones distintas. Una rama puede apuntar
al mismo commit que su remoto y aún contener archivos modificados localmente.

git-sync-status organiza esta pregunta en estados de sincronización e
indicadores del árbol de trabajo. Su alcance documentado cubre la rama actual
y, opcionalmente, otras ramas locales que siguen ramas remotas.

## Los commits y los archivos cuentan historias distintas

El README distingue ramas adelantadas (`SYNC_PENDING`), atrasadas (`LATE`) y
divergentes (`DIVERGED`). Para `SYNCED`, exige tanto la ausencia de commits
exclusivos de cada lado como un árbol de trabajo limpio.

También trata por separado la falta de remoto, la falta de upstream y estados
como `DETACHED_HEAD` o `REMOTE_UNREACHABLE`. No poder consultar el remoto no
debe confundirse con confirmar que todo está actualizado.

## Una salida para personas y automatizaciones

La documentación presenta una interfaz de terminal, salida de texto y JSON.
Mostrar ruta, rama, upstream, contadores e indicadores permite comprender
por qué se produjo un diagnóstico, en lugar de depender solo de un color.

Un ejemplo didáctico sería crear repositorios temporales con cambios locales,
commits pendientes y divergencia. Se podrían comparar sus estados sin poner
en riesgo un proyecto de trabajo.

Este texto se basa en el contrato descrito en el README. Aún hay que ejecutar
los escenarios para convertir la presentación en un tutorial verificado.

## Fuente

[README — git-sync-status](https://github.com/guionardo/git-sync-status/blob/49c0c8d8dcae78646e9e15ec046a0c9fa6c6984c/README.md).
