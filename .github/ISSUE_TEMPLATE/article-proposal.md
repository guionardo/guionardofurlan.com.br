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

## Arquivos anexos

Arraste para esta seção os três Markdown completos e quaisquer imagens ou
arquivos usados pelo texto. Os nomes dos artigos devem terminar em:

```text
<identificador>.pt.md
<identificador>.en.md
<identificador>.es.md
```

Cada artigo deve conter frontmatter YAML com `title`, `description`, `date`,
`slug`, `tags`, `draft: true`, `lang` e `translationKey`. O corpo deve começar
em `##`, sem H1, e usar Markdown compatível com Astro. A mesma
`translationKey` deve aparecer nos três arquivos. Imagens devem ter alt text e
ser referenciadas pelo nome do arquivo anexado.

## Checklist

- [ ] A descrição explica a proposta e suas fontes.
- [ ] O destino está preenchido.
- [ ] Anexei os artigos em PT, EN e ES.
- [ ] Anexei todas as imagens e arquivos necessários.
- [ ] Não incluí segredos, credenciais ou dados privados.
