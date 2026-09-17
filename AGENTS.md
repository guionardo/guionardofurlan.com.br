# Instruções para agentes — portal de Guionardo Furlan

Estas instruções se aplicam a todo o repositório, especialmente à criação e
edição de artigos, páginas, projetos, ferramentas e currículo. Leia também o
README.md e os arquivos envolvidos antes de editar.

## Regra editorial obrigatória: português, inglês e espanhol

- Todo conteúdo destinado aos visitantes deve existir em **português brasileiro
  (pt-BR)**, **inglês (en)** e **espanhol (es)**. Isso inclui artigos, títulos, resumos, tags,
  legendas, textos alternativos de imagens, links com texto, metadados e páginas.
- Crie ou atualize as três versões na mesma entrega. Uma correção factual,
  mudança de link ou atualização de conteúdo deve ser refletida em todas.
- Traduza o significado com linguagem natural, preservando fatos, exemplos,
  ressalvas e intenção. Não acrescente afirmações em apenas uma das versões.
- Preserve nomes próprios, marcas, comandos, identificadores de código e URLs
  externas. Localize links internos para a página equivalente quando existir.
- Documentação interna, como este arquivo e o README, pode ficar em português.
- Se faltarem informações, mantenha as três versões em rascunho e relate a pendência.
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

Para novos artigos, use um conjunto como `tema.pt.md`, `tema.en.md` e `tema.es.md`. O nome do
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
  no formato `YYYY-MM-DD`, igual nas três versões. Não altere a data original
  de um artigo só porque ele foi revisado ou traduzido.
- Declare `lang` e `translationKey` explicitamente em todos os novos artigos,
  mesmo que o schema os aceite como opcionais. O valor do frontmatter é `pt`, `en` ou `es`; para português,
  o idioma do HTML é `pt-BR`.
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

- Novos artigos começam com `draft: true` nos três idiomas. Um pedido para
  escrever ou revisar conteúdo, sozinho, não é um pedido para publicá-lo.
- Quando o usuário solicitar publicação, conclua a revisão de todas as versões
  e altere `draft: false` nas três versões na mesma entrega. Uma autorização já dada deve
  ser respeitada sem pedir confirmação novamente.
- Ao editar artigos publicados, preserve o estado de publicação e atualize
  todas as versões. Não transforme artigos existentes em rascunho sem motivo.
- Não invente corpo ou tradução para preencher uma lacuna factual.
- A aplicação atualmente permite conteúdo sem todas as traduções e `draft` independente.
  **A exigência bilíngue deste arquivo é editorial; o build ainda não a garante.**
  Verifique manualmente as três versões, inclusive arquivos em rascunho.
- Cada push aciona o build e a publicação pelo Cloudflare, conforme as branches
  configuradas no painel. Não faça push, merge ou deploy sem que isso faça
  parte do pedido autorizado.
- Não utilizamos GitHub Actions ou GitHub Pages. Não crie workflows de build
  ou publicação no GitHub; mantenha o processo integrado ao Cloudflare.
- Use `npm run build` para validar localmente antes de um push autorizado.
  Os currículos são PDFs estáticos versionados; sua geração continua manual.

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
  de idiomas em `src/lib/i18n.ts`. A página 404 compartilhada deve atender os três idiomas.
- Português usa `/`; inglês usa `/en/`; espanhol usa `/es/`. Não altere essa convenção casualmente.
- RSS é separado por idioma. O seletor de artigos depende da `translationKey`;
  sem tradução publicada, ele aponta para o blog do outro idioma.
- Centralize o acesso aos artigos em `src/lib/content.ts` e preserve canonical,
  hreflang, acessibilidade e comportamento responsivo.
- Edite os fontes, nunca `dist/`, `.astro/` ou `node_modules/`.

## Verificação antes da entrega

1. Confira se todas as versões existem, estão completas e têm o mesmo sentido.
2. Revise fatos, fontes, links, imagens, metadados, slugs e a chave das traduções.
3. Confira o estado de publicação e a ausência de placeholders em conteúdo
   destinado à publicação.
4. Execute `npm run build` após mudanças de conteúdo ou código. Verifique as
   rotas afetadas, os links entre idiomas e o RSS quando houver publicação.
   Rascunhos devem continuar ausentes das páginas públicas, RSS e sitemap.
5. Na entrega, informe os arquivos dos três idiomas, o que foi validado e
   qualquer pendência. Não afirme que houve publicação só porque o build passou.

Alterações apenas em documentação interna não exigem executar o build.

## Currículos AsciiDoc, Markdown e PDF

- Inglês: `resume/Guionardo_Furlan_Resume.adoc`.
- Português: `resume/Guionardo_Furlan_Resume.pt.adoc`.
- Os `.adoc` são a fonte canônica. As versões Markdown derivadas ficam em
  `src/content/resume/resume-pt.md` e `resume-en.md` e são exibidas nas
  páginas `/sobre/` e `/en/about/` (a página espanhola não exibe currículo).
- Atualize sempre o trio — `.adoc` + `.md` + PDF —, preservando cargos, datas,
  qualificações e contatos, na mesma entrega.
  Os demais arquivos históricos em `resume/` não são fontes de publicação.
- A geração de PDFs é exclusivamente manual, com `npm run build:resume`.
  Não adicione geração automática ao build do site, hooks npm ou pipelines.
- Asciidoctor e Chrome são necessários apenas na máquina que gera os PDFs;
  `CHROME_BIN` permite selecionar o binário.
- Os PDFs em `public/resume/` são versionados e publicados como arquivos estáticos.
  Ao atualizar um currículo, gere e revise os PDFs manualmente e inclua-os
  junto dos fontes na entrega. Não regenere PDFs em tarefas sem esse escopo.
- Alterar AsciiDoc, CSS ou ícones não dispara geração automática.
- Confira visualmente os PDFs nos dois idiomas disponíveis e as páginas
  `/sobre/` e `/en/about/` antes de entregar uma atualização dos currículos.


### Espanhol e builds

- A política de conteúdo público abrange PT, EN e ES. Artigos usam uma única
  translationKey compartilhada pelos três idiomas; novos textos devem incluir
  `lang: es` e revisão da tradução espanhola.
- As páginas espanholas ficam em `src/pages/es/`. Mantenha as correspondências
  de navegação em `src/lib/i18n.ts` e os textos comuns em `Base.astro`.
- Exceção atual: os currículos continuam em PT e EN (PDF e Markdown). A página
  espanhola identifica explicitamente seu download como inglês; não apresenta
  uma tradução inexistente. Mantenha as fontes AsciiDoc e Markdown sincronizadas.
- `npm run build` (ou `npm run run`) compila apenas o site e copia os PDFs
  versionados para `dist/resume/`. `build:site` executa o Astro diretamente.
  O build e os pipelines não dependem de Asciidoctor ou Chrome.
