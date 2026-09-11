---
title: "TypedHandler: da requisição HTTP para um contrato tipado"
description: "Tags, generics e reutilização de objetos na organização da entrada de uma API Go."
date: "2026-09-11"
slug: "typedhandler-requisicao-contrato-tipado"
tags: ["Go", "APIs", "arquitetura"]
draft: true
lang: "pt"
translationKey: "typedhandler-introduction"
---

## Onde começa a lógica da aplicação?

Uma requisição HTTP pode espalhar seus dados pelo caminho, pela query string,
pelos headers e pelo corpo. Antes de executar uma regra de negócio, o handler
precisa reunir e converter essas entradas.

O TypedHandler propõe descrever esse contrato em structs Go. Segundo o README,
as tags indicam as fontes dos dados e generics conectam o parser ao handler.
Isso torna a organização da entrada um tema explícito da API.

## O custo da abstração

A documentação descreve reflexão na inicialização do parser, com metadados
reutilizados, e uso de `sync.Pool` para reaproveitar objetos de requisição.
Também apresenta estratégias para interpretar o corpo e interfaces para
personalizar erros e limpeza de objetos.

Essas escolhas levantam questões úteis: o contrato continua fácil de ler?
Como os erros de conversão chegam à resposta HTTP? Que estado precisa ser
limpo antes de reutilizar uma instância?

## Medir antes de prometer

O projeto se apresenta como orientado a poucas alocações. Aqui, isso é um
objetivo documentado, não um resultado de benchmark reproduzido.

Um artigo experimental pode comparar um handler explícito com a versão tipada,
medindo alocações e latência com entradas equivalentes. Casos de erro e
requisições sucessivas também importam: rapidez não substitui isolamento
correto dos dados entre execuções.

A proposta rende uma discussão sobre abstrações pequenas em Go: quanto trabalho
repetido elas retiram e quais responsabilidades continuam com a aplicação.
Este primeiro rascunho delimita essa investigação a partir do README.

## Fonte

[README — typedhandler](https://github.com/guionardo/typedhandler/blob/65417d53a0d00e53732ce29390e377361c523fa2/README.md).
