# Imagem de destaque nos artigos (hero image) — Design

Data: 2026-09-17
Status: Aprovado (Guionardo)

## Objetivo

Permitir que cada artigo tenha uma imagem de destaque no topo da página,
usada também como `og:image` no lugar da imagem default por idioma.

## Modelo de dados

- Blog (`src/content.config.ts`): novos campos opcionais `heroImage`
  (caminho, ex.: `/images/<artigo>/hero.png`) e `heroImageAlt` (texto
  alternativo traduzido em cada versão de idioma — regra editorial).
- Imagens ficam em `public/images/<artigo>/`, versionadas.

## Comportamento

- `src/pages/*/blog/[slug].astro`: renderiza `<img>` da hero no topo do
  artigo (entre o link de voltar e o cabeçalho) quando `heroImage` existe.
- `src/layouts/Base.astro`: novos props `image` e `imageAlt`. Quando
  presentes, `og:image`/`og:image:alt` usam a imagem do artigo; senão, caem
  no default por idioma (`og-default.<lang>.png` + alt localizado).
- `og:image:width/height` são emitidos apenas para a imagem default
  (1200×630 conhecido).

## Validação

- `npm run build`.
- Verificação temporária: `heroImage` num artigo publicado → `og:image` aponta
  para a hero e `<img>` presente; revertido em seguida.
- Páginas sem hero continuam com a imagem default.