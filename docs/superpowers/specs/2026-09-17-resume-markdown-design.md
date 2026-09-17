# Currículo em Markdown renderizado no site — Design

Data: 2026-09-17
Status: Aprovado (Guionardo)

## Objetivo

Exibir o currículo completo na página "Sobre" sem exigir download do PDF.
Os arquivos `.adoc` continuam como fonte canônica; versões Markdown
derivadas são renderizadas inline.

## Modelo

- Nova collection `resume` (`src/content/resume/resume-<lang>.md`), schema
  apenas com `lang` (pt/en). Conteúdo derivado manualmente dos `.adoc`
  (fatos preservados; sem invenções).
- Sincronia manual: atualizar `.adoc` + `.md` + PDF (trio), como hoje é o par.
- `src/lib/content.ts`: helper `getResume(lang)`.

## Páginas

- `src/pages/sobre.astro` e `src/pages/en/about.astro`: seção "Trajetória
  profissional" passa a renderizar o currículo via `<Content />` (`.prose`),
  mantendo o botão de download do PDF.
- `src/pages/es/sobre.astro`: inalterado (sem currículo em espanhol; mantém
  apenas o download do PDF em inglês, como hoje).

## Validação

- `npm run build` sem erros; páginas sobre/about exibem o conteúdo e o botão
  de download continua funcionando.