# Instruções para agentes — portal de Guionardo Furlan

Estas instruções se aplicam a todo o repositório, especialmente à criação e
edição de artigos, páginas, projetos, ferramentas e currículo. Leia também o
README.md e os arquivos envolvidos antes de editar.

## Regra editorial obrigatória: português e inglês

- Todo conteúdo destinado aos visitantes deve existir em **português brasileiro
  (pt-BR)** e **inglês (en)**. Isso inclui artigos, títulos, resumos, tags,
  legendas, textos alternativos de imagens, links com texto, metadados e páginas.
- Crie ou atualize as duas versões na mesma entrega. Uma correção factual,
  mudança de link ou atualização de conteúdo deve ser refletida em ambas.
- Traduza o significado com linguagem natural, preservando fatos, exemplos,
  ressalvas e intenção. Não acrescente afirmações em apenas uma das versões.
- Preserve nomes próprios, marcas, comandos, identificadores de código e URLs
  externas. Localize links internos para a página equivalente quando existir.
- Documentação interna, como este arquivo e o README, pode ficar em português.
- Se faltarem informações, mantenha o par em rascunho e relate a pendência.
  Não publique apenas um idioma para contornar uma tradução incompleta.

## Voz e precisão

- Escreva de forma clara, direta e profissional, sem exageros promocionais,
  frases genéricas de IA ou repetição desnecessária.
- Use primeira pessoa somente para ideias e experiências fornecidas ou
  confirmadas pelo autor. Não invente empregos, formação, clientes, resultados,
  métricas, depoimentos ou experiências pessoais de Guionardo.
- Diferencie fatos, opiniões e exemplos hipotéticos. Identifique exemplos como
  exemplos; nunca apresente conteúdo demonstrativo como trabalho realizado.
- Verifique afirmações técnicas e informações que podem mudar em fontes
  primárias, indicando os links pertinentes no texto. Nunca invente referências.
- Preserve a intenção e as alterações existentes do autor. Evite reescrever
  trechos não relacionados ao pedido.
- Não inclua segredos, credenciais, dados privados ou material de terceiros
  sem autorização de uso. Prefira paráfrases e citações curtas com fonte.

## Artigos em Markdown

O formato implementado é Markdown em `src/content/blog/`. AsciiDoc ainda não
tem suporte: não crie arquivos `.adoc` esperando que sejam publicados.

Para novos artigos, use um par como `tema.pt.md` e `tema.en.md`. O nome do
arquivo não define a URL. Consulte `src/content.config.ts` para o schema real.

Exemplo de metadados para a versão portuguesa:

```yaml
---
title: 'Título em português'
description: 'Resumo específico do conteúdo do artigo.'
date: 2026-09-10
slug: titulo-em-portugues
tags: [desenvolvimento]
draft: true
lang: pt
translationKey: identificador-estavel-do-artigo
---
```

Versão inglesa correspondente:

```yaml
---
title: 'English title'
description: 'A specific summary of the article.'
date: 2026-09-10
slug: english-title
tags: [development]
draft: true
lang: en
translationKey: identificador-estavel-do-artigo
---
```

- Substitua os valores de exemplo. Use a data real acordada para publicação,
  no formato `YYYY-MM-DD`, igual nas duas versões. Não altere a data original
  de um artigo só porque ele foi revisado ou traduzido.
- Declare `lang` e `translationKey` explicitamente em todos os novos artigos,
  mesmo que o schema os aceite como opcionais. O valor do frontmatter é `pt`,
  enquanto o idioma do HTML é `pt-BR`.
- Compartilhe uma `translationKey` estável entre exatamente um arquivo de cada
  idioma. Ela não deve ser traduzida nem reutilizada para outro artigo.
- Slugs usam letras minúsculas ASCII, números e hífens; são únicos por idioma.
  Preserve slugs já publicados para evitar quebrar links.
- Comece o corpo em `##`: o título principal já é renderizado pelo layout.
  Identifique a linguagem de blocos de código e escreva texto alternativo útil
  para imagens. Não use links ou imagens fictícios.
- Armazene imagens em `public/images/<identificador-do-artigo>/` e referencie-as
  por `/images/...`. Compartilhe o arquivo entre traduções quando apropriado;
  traduza legendas e descrições, e também texto incorporado à imagem se houver.

## Rascunhos e publicação

- Novos artigos começam com `draft: true` nos dois idiomas. Um pedido para
  escrever ou revisar conteúdo, sozinho, não é um pedido para publicá-lo.
- Quando o usuário solicitar publicação, conclua a revisão de ambas as versões
  e altere `draft: false` no par na mesma entrega. Uma autorização já dada deve
  ser respeitada sem pedir confirmação novamente.
- Ao editar artigos publicados, preserve o estado de publicação e atualize
  ambas as versões. Não transforme artigos existentes em rascunho sem motivo.
- Não invente corpo ou tradução para preencher uma lacuna factual.
- A aplicação atualmente permite conteúdo sem par e `draft` independente.
  **A exigência bilíngue deste arquivo é editorial; o build ainda não a garante.**
  Verifique manualmente o par, inclusive arquivos em rascunho.
- Alterações na `main` acionam publicação via GitHub Actions. Não faça push,
  merge ou deploy sem que isso faça parte do pedido autorizado.

## Páginas e navegação

Atualize sempre os arquivos correspondentes:

| Português | Inglês |
| --- | --- |
| `src/pages/index.astro` | `src/pages/en/index.astro` |
| `src/pages/sobre.astro` | `src/pages/en/about.astro` |
| `src/pages/projetos.astro` | `src/pages/en/projects.astro` |
| `src/pages/ferramentas.astro` | `src/pages/en/tools.astro` |
| `src/pages/blog/index.astro` | `src/pages/en/blog/index.astro` |
| `src/pages/blog/[slug].astro` | `src/pages/en/blog/[slug].astro` |
| `src/pages/rss.xml.ts` | `src/pages/en/rss.xml.ts` |

- Navegação, seletor de idioma e metadados compartilhados estão em
  `src/layouts/Base.astro`. Novas páginas precisam de correspondência no mapa
  de idiomas desse layout. A página 404 compartilhada deve atender ambos.
- Português usa `/`; inglês usa `/en/`. Não altere essa convenção casualmente.
- RSS é separado por idioma. O seletor de artigos depende da `translationKey`;
  sem tradução publicada, ele aponta para o blog do outro idioma.
- Centralize o acesso aos artigos em `src/lib/content.ts` e preserve canonical,
  hreflang, acessibilidade e comportamento responsivo.
- Edite os fontes, nunca `dist/`, `.astro/` ou `node_modules/`.

## Verificação antes da entrega

1. Confira se ambas as versões existem, estão completas e têm o mesmo sentido.
2. Revise fatos, fontes, links, imagens, metadados, slugs e a chave do par.
3. Confira o estado de publicação e a ausência de placeholders em conteúdo
   destinado à publicação.
4. Execute `npm run build` após mudanças de conteúdo ou código. Verifique as
   rotas afetadas, os links entre idiomas e o RSS quando houver publicação.
   Rascunhos devem continuar ausentes das páginas públicas, RSS e sitemap.
5. Na entrega, informe os arquivos dos dois idiomas, o que foi validado e
   qualquer pendência. Não afirme que houve publicação só porque o build passou.

Alterações apenas em documentação interna não exigem executar o build.

## Currículos AsciiDoc e PDF

- Inglês: `resume/Guionardo_Furlan_Resume.adoc`.
- Português: `resume/Guionardo_Furlan_Resume.pt.adoc`.
- Atualize sempre o par, preservando cargos, datas, qualificações e contatos.
  Os demais arquivos históricos em `resume/` não são fontes de publicação.
- Execute `npm run build:resume` antes de `npm run build` quando o currículo
  mudar. Requer Asciidoctor e Chrome; `CHROME_BIN` permite selecionar o binário.
- PDFs gerados ficam em `public/resume/`, ignorados pelo Git. Não edite os PDFs.
- O Actions gera os dois arquivos quando o cache dos fontes e recursos muda;
  alterações em qualquer AsciiDoc, CSS, ícone ou script invalidam esse cache.
- Confira visualmente os PDFs nos dois idiomas antes de entregar mudanças.
