---
title: "fan-control: cuando Go se encuentra con la refrigeración del servidor"
description: "Un proyecto que conecta sensores de temperatura, comunicación serial y control de ventiladores."
date: "2026-09-11"
slug: "fan-control-go-refrigeracion-servidor"
tags: ["Go", "electrónica", "DIY"]
draft: true
lang: "es"
translationKey: "fan-control-introduction"
---

## Un problema que abarca software y hardware

El objetivo documentado de fan-control es reducir el ruido de los ventiladores
de un servidor sin perder la respuesta a la demanda de la CPU. La propuesta
combina una controladora Arduino Digispark/ATtiny85 con un gestor escrito en Go.

El README describe la responsabilidad del gestor: obtener temperaturas,
calcular la respuesta de los ventiladores y comunicarse con la controladora
mediante el puerto serial. Es un ejemplo concreto de software que necesita
interactuar con el mundo físico.

## Dos pasos, dos informaciones distintas

En la primera versión prevista, la controladora informa periódicamente del
valor PWM actual. El gestor relaciona ese valor con las temperaturas y envía
un nuevo comando cuando es necesario. Para la segunda versión, el documento
propone medir también la velocidad real de los ventiladores.

Esta separación plantea una pregunta interesante: ¿enviar un comando basta
para saber que el equipo respondió? Medir la rotación aporta información
distinta del valor de control enviado.

## Un experimento que merece documentarse

Un artículo práctico podría registrar temperaturas, comandos y rotación bajo
una carga controlada, además de observar qué ocurre cuando falla la comunicación.
Son temas para investigar, no resultados ya demostrados aquí.

El README presenta objetivos y versiones previstas. Este borrador no verifica
el montaje, no ofrece instrucciones de cableado ni afirma una reducción medida
del ruido. La historia está en el camino entre la propuesta y su validación.

## Fuente

[README — fan-control](https://github.com/guionardo/fan-control/blob/264a5e584aa6a7c635eb06085e5ca0c58e589d9e/README.md).
