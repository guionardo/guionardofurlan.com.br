---
title: "fan-control: quando Go encontra a ventilação do servidor"
description: "Um projeto que conecta sensores de temperatura, comunicação serial e controle de ventoinhas."
date: "2026-09-11"
slug: "fan-control-go-ventilacao-servidor"
tags: ["Go", "eletrônica", "DIY"]
draft: true
lang: "pt"
translationKey: "fan-control-introduction"
---

## Um problema que atravessa software e hardware

O objetivo documentado do fan-control é reduzir o ruído das ventoinhas de um
servidor sem perder a resposta à demanda da CPU. A proposta combina uma
controladora baseada em Arduino Digispark/ATtiny85 com um gerenciador em Go.

O README descreve a responsabilidade do gerenciador: obter as temperaturas,
calcular a resposta das ventoinhas e se comunicar com a controladora pela
porta serial. É um exemplo concreto de software que precisa conversar com
o mundo físico.

## Dois passos, duas informações diferentes

Na primeira versão planejada, a controladora informa periodicamente o PWM
atual. O gerenciador relaciona esse valor às temperaturas e envia um novo
comando quando necessário. Para a segunda versão, o documento prevê medir
também a velocidade real das ventoinhas.

Essa separação rende uma pergunta interessante: enviar um comando é suficiente
para saber que o equipamento respondeu? A medição da rotação acrescenta uma
informação diferente do valor de controle enviado.

## O experimento que vale registrar

Um artigo prático pode acompanhar temperaturas, comandos e rotação em uma
carga controlada, além de observar o comportamento quando a comunicação falha.
Esses são pontos para investigação, não resultados já demonstrados aqui.

O README apresenta objetivos e versões planejadas. Este rascunho não comprova
a montagem, não fornece instruções elétricas e não afirma uma redução medida
de ruído. A história está justamente no caminho entre a proposta e sua validação.

## Fonte

[README — fan-control](https://github.com/guionardo/fan-control/blob/264a5e584aa6a7c635eb06085e5ca0c58e589d9e/README.md).
