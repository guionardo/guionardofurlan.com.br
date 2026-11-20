---
name: Proposta de artigo
about: Enviar um artigo completo para revisão e abertura automática de PR
title: "[artigo] "
labels: ""
assignees: ""
---

## Descrição

Explique o tema, o objetivo do artigo, o público, os fatos que precisam ser
verificados e as fontes relevantes. Não inclua segredos ou dados privados.

## Destino

Substitua o valor abaixo por uma das opções:

```text
Destino: blog
```

ou:

```text
Destino: series:<seriesKey>
```

Para outra seção ainda não suportada pelo workflow, descreva o destino e aguarde
a orientação antes de abrir a issue.

## Artigo pt

Cole o artigo completo em um bloco de código com quatro crases. Use cinco ou
mais crases se o próprio artigo tiver um bloco com quatro crases:

````markdown
---
title: 'Título em português'
description: 'Descrição específica.'
date: 2026-11-20
slug: titulo-em-portugues
tags: [desenvolvimento]
draft: true
lang: pt
translationKey: identificador-estavel
---

## Primeiro subtítulo

Texto do artigo.
````

## Artigo en

Cole a versão inglesa completa usando o mesmo formato e a mesma
`translationKey`, mas com `lang: en`.

## Artigo es

Cole a versão espanhola completa usando o mesmo formato e a mesma
`translationKey`, mas com `lang: es`.

Cada artigo deve conter frontmatter YAML com `title`, `description`, `date`,
`slug`, `tags`, `draft: true`, `lang` e `translationKey`. O corpo deve começar
em `##`, sem H1, e usar Markdown compatível com Astro. A mesma
`translationKey` deve aparecer nos três blocos. Imagens devem ter alt text e
usar URLs acessíveis; a issue não aceita anexos binários.

## Checklist

- [ ] A descrição explica a proposta e suas fontes.
- [ ] O destino está preenchido.
- [ ] Colei os artigos completos em PT, EN e ES.
- [ ] As imagens e os demais arquivos usados têm URLs acessíveis.
- [ ] Não incluí segredos, credenciais ou dados privados.
