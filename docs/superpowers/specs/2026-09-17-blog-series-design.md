# Séries de Artigos no Blog — Design

Data: 2026-09-17
Status: Implementado (aprovado por Guionardo)

## Objetivo

Agrupar artigos relacionados em séries ordenadas, com navegação capítulo a
capítulo e páginas de série, nos três idiomas (pt/en/es), sem JS no cliente.

## Modelo de dados

- Blog (`src/content/blog/*.md`): novos campos opcionais `seriesKey` e
  `seriesOrder` (número inteiro). A mesma `seriesKey` liga as versões pt/en/es
  de uma série; a ordem é por idioma.
- Nova collection `series` (`src/content/series/<key>-<lang>.md`): campos
  `lang`, `name`, `description`. O id da entrada é `<key>-<lang>` (hífen, não
  ponto — o loader do Astro aplica github-slugger ao id e remove pontos).
- Validação em `getPosts`: `seriesKey` exige `seriesOrder`; ordem duplicada
  dentro da mesma série lança erro no build.

## Componentes

- `src/lib/content.ts`: `getSeries(lang)`, `getSeriesEntry(key, lang)`,
  `getSeriesPosts(key, lang)` (ordenado por `seriesOrder`) e
  `seriesKeyFromId(id)`.
- `src/components/SeriesNav.astro`: painel no rodapé do artigo com nome da
  série, lista numerada de capítulos (atual com `aria-current`), links
  prev/next com `rel="prev"`/`rel="next"` e textos localizados via
  `seriesCopy` em `src/lib/i18n.ts`.
- Páginas: `blog/series/` (índice) e `blog/series/[key]/` em pt, en e es;
  links de idioma explícitos (a `key` é estável entre idiomas).

## Decisões importantes

- **Slugs únicos por idioma**: no Astro, o id da entrada = slug do frontmatter
  e ids são únicos na coleção inteira (não por idioma). Seguir a convenção
  existente (ex.: `fan-control-go-server-cooling` vs
  `fan-control-go-refrigeracion-servidor`): `k3s-homelab` (pt),
  `k3s-homelab-debian-server` (en), `k3s-homelab-servidor-debian` (es).
- **Rascunhos**: artigos novos começam `draft: true`; séries vazias exibem
  estado vazio nas páginas públicas.
- **RSS/sitemap**: sem mudanças; rascunhos continuam excluídos.

## Conteúdo inicial

- Série `homelab-k3s` ("Homelab Kubernetes"): 2 artigos × 3 idiomas, copiados
  de `working/articles/` para `src/content/blog/` como rascunhos, com
  frontmatter (título, descrição, data 2026-09-17, tags, `translationKey`,
  `seriesKey`, `seriesOrder`). Os fontes em `working/articles/` foram mantidos.
- Diagramas mermaid dos artigos renderizam via `astro-mermaid` já integrado.

## Validação

- `npm run build` sem erros (28 páginas com tudo em rascunho; 34 com os
  artigos temporariamente publicados).
- Publicação temporária (depois revertida) confirmou: painel SeriesNav com
  capítulos, prev/next corretos por idioma, seletor de idioma/hreflang via
  `translationKey` e páginas de série listando os capítulos.
- RSS e sitemap sem rascunhos.