# Mermaid Diagrams no Portal — Design

Data: 2026-09-16
Status: Aprovado (Guionardo)

## Objetivo

Permitir diagramas Mermaid em artigos Markdown (`src/content/blog/*.md`),
renderizados como SVG no navegador — sem custo de build extra.

## Abordagem escolhida

- Renderização **client-side** via integração oficial `astro-mermaid` (v2.1.0,
  MIT, peer `astro >=4` e `mermaid ^10 || ^11`), que transforma blocos
  ` ```mermaid ` em `<pre class="mermaid">` no build e renderiza o SVG no
  navegador — sem custo de build Playwright e sem JS quando não há diagramas.
- Diagramas são escritos como blocos de código com linguagem `mermaid` nos
  arquivos `.md` (pt/en/es), independentemente de idioma.

## Mudanças

1. Instalar `astro-mermaid` como dependência e `mermaid@11.17.2` (pin por
   audit: v12 traz chevrotain → lodash-es vulnerável).
2. Em `astro.config.mjs`, adicionar a integração:

   ```js
   import mermaid from 'astro-mermaid';
   // ...
   integrations: [mermaid(), sitemap()],
   ```

3. Nenhuma mudança em componentes ou páginas — o transform do build cobre os
   artigos dos três idiomas.

## Comportamento

- Tema padrão (`default`); `autoTheme` habilitado por padrão reage a
  `data-theme` no HTML caso dark mode seja adotado no futuro.
- `securityLevel: strict` (padrão da integração).
- Páginas sem diagramas não carregam o bundle do Mermaid.

## Validação

- `npm run build` sem erros; `npm audit` limpo.
- Verificação em headless browser (Playwright + Chrome local): página de teste
  com ` ```mermaid ` produz 1 SVG dentro de `pre.mermaid`, com conteúdo, e zero
  erros de console. Rascunho de teste removido após a checagem.