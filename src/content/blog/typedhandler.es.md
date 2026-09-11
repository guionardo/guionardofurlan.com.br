---
title: "TypedHandler: de la petición HTTP a un contrato tipado"
description: "Tags, generics y reutilización de objetos para organizar la entrada de una API Go."
date: "2026-09-11"
slug: "typedhandler-peticion-contrato-tipado"
tags: ["Go", "APIs", "arquitectura"]
draft: true
lang: "es"
translationKey: "typedhandler-introduction"
---

## ¿Dónde empieza la lógica de la aplicación?

Una petición HTTP puede repartir sus datos entre la ruta, la query string,
los headers y el cuerpo. Antes de ejecutar una regla de negocio, el handler
necesita reunir y convertir esas entradas.

TypedHandler propone describir ese contrato mediante structs Go. Según el
README, las tags identifican las fuentes de datos y los generics conectan
el parser con el handler. Así, organizar la entrada se vuelve una parte
explícita de la API.

## El coste de la abstracción

La documentación describe reflexión durante la inicialización del parser,
con metadatos reutilizados, y `sync.Pool` para reutilizar objetos de petición.
También presenta estrategias para interpretar el cuerpo e interfaces para
personalizar errores y limpieza de objetos.

Estas decisiones plantean preguntas útiles: ¿el contrato sigue siendo fácil
de leer? ¿Cómo llegan los errores de conversión a la respuesta HTTP? ¿Qué
estado debe limpiarse antes de reutilizar una instancia?

## Medir antes de prometer

El proyecto se presenta como orientado a pocas asignaciones de memoria.
Aquí eso es un objetivo documentado, no un resultado de benchmark reproducido.

Un artículo experimental podría comparar un handler explícito con la versión
tipada, midiendo asignaciones y latencia con entradas equivalentes. También
importan los casos de error y las peticiones sucesivas: la rapidez no sustituye
el aislamiento correcto de los datos entre ejecuciones.

La propuesta abre una discusión sobre pequeñas abstracciones en Go: cuánto
trabajo repetido eliminan y qué responsabilidades conserva la aplicación.
Este primer borrador delimita esa investigación a partir del README.

## Fuente

[README — typedhandler](https://github.com/guionardo/typedhandler/blob/65417d53a0d00e53732ce29390e377361c523fa2/README.md).
