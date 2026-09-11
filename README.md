# Portal pessoal — Guionardo Furlan

Portal estático em Astro, com artigos em Markdown e publicação automática pelo Cloudflare Workers Builds a cada push no repositório.

Agentes de IA devem seguir [AGENTS.md](AGENTS.md). Todo novo conteúdo público
deve ser entregue em português e inglês, com atualizações sincronizadas.

## Desenvolvimento

Requer Node.js 22.12 ou superior.

```sh
npm ci
npm run dev
npm run build
npm run preview
```

## Publicar artigos

Use `src/content/blog/primeiro-artigo.md` e `first-article.en.md` como modelos
para criar o par português/inglês. Altere título, descrição, data, slug, tags e
translationKey e escreva as duas versões. Mantenha `draft: true` até a revisão;
quando a publicação for solicitada, defina `draft: false` em ambas.
O slug define a URL permanente `/blog/slug/`, independente do nome do arquivo.
Rascunhos não entram nas páginas, RSS ou sitemap. Slugs publicados duplicados
interrompem a compilação. Datas são exibidas em UTC para evitar mudança de dia.
Imagens ficam em `public/images/<slug>/`.

Markdown é o formato implementado. AsciiDoc é uma evolução futura: um loader e
renderizador precisarão normalizar os mesmos metadados e preservar os slugs.
O acesso às publicações está centralizado em `src/lib/content.ts`.

## Personalizar

- Apresentação: `src/pages/index.astro`.
- Trajetória: `src/pages/sobre.astro` e `src/pages/en/about.astro`.
  Currículos: veja a seção de geração de PDFs abaixo.
- Projetos e trabalhos: `src/pages/projetos.astro`.
- Catálogo de produtos: `src/pages/ferramentas.astro`.
- Tema: `src/styles/global.css`.

As áreas sem conteúdo real têm estados vazios. O artigo inicial é um rascunho,
e não há experiências, projetos ou contatos fictícios publicados.
As fontes vêm do Google Fonts, com fontes locais de fallback.

## Publicação pelo Cloudflare

O repositório GitHub contém os fontes e os PDFs estáticos. O Cloudflare está
conectado ao repositório e executa automaticamente o build e a publicação a
cada push, conforme a configuração de branches no painel.

- Comando de build: `npm run build` (ou `npm run run`).
- Saída estática: `dist/`, incluindo os currículos de `public/resume/`.
- O comando de deploy, as branches e o domínio são gerenciados no Cloudflare.
- Não há workflow de GitHub Actions neste projeto. Não recrie uma publicação
  paralela por Actions ou GitHub Pages.

Antes de enviar alterações, valide o site localmente com `npm run build`.
Um push pode publicar imediatamente o conteúdo: confirme que os artigos
prontos estão nos três idiomas e que os demais permanecem em rascunho.
Os PDFs são atualizados manualmente e devem ser incluídos no commit.

O domínio canônico permanece `guionardofurlan.com.br`, definido em
`astro.config.mjs`, nos feeds RSS e em `public/robots.txt`. Alterações de domínio
ou de configuração do Cloudflare devem ser feitas apenas quando solicitadas.

## Português e inglês

Português permanece na raiz (`/`); inglês fica em `/en/`. O seletor PT / EN
preserva a seção e aponta para a tradução de um artigo quando disponível.
Sem tradução publicada, ele abre o blog do outro idioma. Não há tradução automática.
Os feeds são `/rss.xml` e `/en/rss.xml`, com publicações separadas por idioma.

Para traduzir um artigo, crie dois arquivos Markdown com `lang: pt` e `lang: en`.
Use a mesma `translationKey` em ambos e slugs próprios para cada idioma:

```yaml
lang: en
translationKey: primeiro-artigo
slug: my-first-article
```

Traduza título, descrição, tags e corpo. Embora o sistema aceite `draft`
independente, a regra editorial exige publicar o par completo e sincronizado;
o build ainda não valida essa exigência. Rascunhos nunca são oferecidos como
traduções publicadas. Arquivos antigos sem
`lang` continuam em português. Slugs e translationKeys são únicos por idioma.
As páginas incluem idioma HTML, canonical e hreflang para traduções existentes.

## Currículos em PDF

A geração dos currículos é **manual**. Os PDFs publicados ficam versionados em:

- `public/resume/Guionardo_Furlan_Resume.pt.pdf`.
- `public/resume/Guionardo_Furlan_Resume.en.pdf`.

O build do site apenas copia esses arquivos para `dist/resume/`. Não gera PDFs,
mesmo quando os fontes AsciiDoc mudam. O Cloudflare não precisa
instalar Asciidoctor ou Chrome para compilar o portal.

Para atualizar os currículos, revise as duas fontes:

- Inglês: `resume/Guionardo_Furlan_Resume.adoc`.
- Português: `resume/Guionardo_Furlan_Resume.pt.adoc`.

As fontes compartilham `resume/resume.css` e `resume/icons/`. Os outros
currículos, HTMLs e PDFs em `resume/` são históricos e não são publicados.

Na máquina local, com Asciidoctor 2.0.26 e Chrome instalados, execute:

```sh
npm run build:resume
```

`npm run build:resume -- pt` ou `-- en` gera apenas um idioma. `CHROME_BIN`
permite selecionar outro executável compatível com Chrome headless.
Confira visualmente os PDFs e inclua os arquivos atualizados de `public/resume/`
no mesmo commit dos fontes. O script preserva os arquivos históricos de `resume/`.

Cada página Sobre oferece o PDF correspondente. Um checkout já contém os PDFs;
não é necessário regenerá-los antes da prévia ou do build do site.

## Espanhol

O site também está disponível em `/es/`, com navegação PT / EN / ES, feed
`/es/rss.xml` e metadados por idioma. Artigos espanhóis usam `lang: es` e a
mesma `translationKey` das outras versões. Rascunhos não aparecem como
traduções publicadas. O download do currículo na página espanhola é oferecido
explicitamente em inglês; os PDFs continuam disponíveis em PT e EN.

## Comando de build no Cloudflare Workers Builds

Use `npm run build` (ou `npm run run`). O comando compila o site com Astro e
inclui os PDFs já versionados em `public/resume/` na saída `dist/resume/`.
`npm run build:site` é um alias para executar diretamente o build do Astro.
Nenhum desses comandos gera os currículos ou exige Asciidoctor/Chrome.
O comando de deploy do Worker permanece o configurado no Cloudflare.
