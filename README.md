# Portal pessoal — Guionardo Furlan

Portal estático em Astro, com artigos em Markdown e publicação no GitHub Pages.

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

## GitHub Actions e domínio

1. Crie um repositório no GitHub e envie estes arquivos para a branch `main`,
   incluindo `package-lock.json`.
2. Em **Settings → Pages → Build and deployment**, selecione **GitHub Actions**.
3. Em **Custom domain**, configure `guionardofurlan.com.br`.
4. No provedor DNS, configure o domínio raiz conforme a documentação atual
   do GitHub Pages e o CNAME de `www` para `<usuario>.github.io`.
   Preserve os registros de e-mail e outros serviços existentes.
5. Após a validação DNS e emissão do certificado, habilite **Enforce HTTPS**.

Pull requests executam o build; atualizações da `main` também publicam `dist/`.
O domínio canônico está em `astro.config.mjs`, RSS e `public/robots.txt`.
Não é necessário CNAME no diretório público ao publicar via Actions.

- [Domínio personalizado](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
- [Publicação Astro no GitHub Pages](https://docs.astro.build/en/guides/deploy/github/)

O workflow está preparado, mas repositório remoto, Pages e DNS precisam ser
configurados na conta do proprietário. Aplicações com backend podem ser
hospedadas separadamente e vinculadas no catálogo por subdomínios.

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

Fontes ativos:

- Inglês: `resume/Guionardo_Furlan_Resume.adoc`.
- Português: `resume/Guionardo_Furlan_Resume.pt.adoc`.

As duas versões usam `resume/resume.css` e `resume/icons/`. Preserve a
correspondência factual entre elas. Os outros currículos, HTMLs e PDFs em
`resume/` são históricos e não são publicados pelo pipeline.

Para gerar localmente, instale Asciidoctor 2.0.26 e Google Chrome e execute:

```sh
npm run build:resume
npm run build
```

`npm run build:resume -- pt` ou `-- en` gera apenas um idioma. `CHROME_BIN`
pode apontar para outro executável compatível com Chrome headless.
A geração trabalha em uma pasta temporária, preservando os arquivos originais.

Downloads: `/resume/Guionardo_Furlan_Resume.pt.pdf` e
`/resume/Guionardo_Furlan_Resume.en.pdf`. Cada página Sobre oferece seu idioma.
Antes da primeira prévia local, gere os PDFs com o comando acima.

O workflow de Pages restaura os PDFs usando uma chave calculada sobre os
AsciiDocs, CSS, ícones, script gerador e workflow. Sem cache correspondente,
instala Asciidoctor e gera ambos os PDFs usando Chrome no runner Ubuntu.
Portanto, uma alteração em `Guionardo_Furlan_Resume.adoc` (ou na tradução)
regenera os currículos no próximo push/PR para `main`. Em pushes na `main`,
os PDFs atualizados seguem com o site para o Pages. Não é necessário commitar
os PDFs gerados. O build falha se a geração falhar, sem publicar um PDF antigo.
