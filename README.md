# Portal pessoal — Guionardo Furlan

Portal estático em Astro, com artigos em Markdown e publicação automática pelo Cloudflare Workers Builds a cada push no repositório.

Agentes de IA devem seguir [AGENTS.md](AGENTS.md). Todo novo conteúdo público
deve ser entregue em português e inglês, com atualizações sincronizadas.

## Propor artigos por issue

Propostas de artigos podem ser abertas como issues usando o modelo
`.github/ISSUE_TEMPLATE/article-proposal.md`. A issue deve conter:

- uma descrição clara da proposta, incluindo fatos, fontes e ressalvas que
  precisam ser preservados;
- o destino, com `blog` para um post comum ou `series:<seriesKey>` para um
  post associado a uma série existente;
- os três artigos completos no texto da issue, em blocos de código identificados
  como `Artigo pt`, `Artigo en` e `Artigo es`;
- URLs acessíveis para imagens e outros arquivos usados pelo artigo.

O corpo do artigo deve ser Markdown compatível com Astro: frontmatter YAML
entre `---`, seguido diretamente de conteúdo iniciado em `##` (o layout já
renderiza o título). Cada idioma precisa declarar `title`, `description`,
`date`, `slug`, `tags`, `draft: true`, `lang` e a mesma `translationKey`; os
slugs devem ser minúsculos, ASCII e separados por hífens. Preserve comandos,
nomes próprios e URLs. Como a issue não transporta arquivos binários, imagens
e anexos devem usar URLs já acessíveis no Markdown, com texto alternativo útil.
Não use H1, links fictícios ou placeholders.

O workflow valida a descrição, os três blocos de Markdown e os metadados,
cria os arquivos no destino indicado, executa `npm run build`, abre uma branch
`article/issue-<número>` e cria um pull request para `main`. Uma issue inválida
não cria PR. A revisão editorial continua obrigatória; abrir a issue não
publica o artigo.

Para permitir que o workflow abra o PR, habilite no repositório GitHub a opção
**Settings → Actions → General → Workflow permissions → Allow GitHub Actions to
create and approve pull requests**. O workflow já declara `contents: write` e
`pull-requests: write`, mas essa opção do repositório é uma permissão adicional
exigida pelo GitHub. Se a validação passar e a abertura do PR falhar por esse
motivo, habilite a opção e reexecute o job falho; a branch e o commit já terão
sido criados.

Agentes que suportam skills podem usar `skills/publish-blog-article/SKILL.md`
para preparar e enviar a proposta seguindo este fluxo.

### Instalar a skill

Depois que este repositório estiver publicado no GitHub, use uma destas
opções em uma máquina nova. O repositório privado exige autenticação GitHub.

#### Codex

O instalador do Codex copia a skill para `~/.codex/skills/`:

```sh
python3 ~/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py \
  --repo guionardo/guionardofurlan.com.br \
  --path skills/publish-blog-article
```

#### Claude Code e OpenCode

Os dois agentes reconhecem o formato padrão `SKILL.md`. O diretório global do
Claude Code também é aceito pelo OpenCode, então a mesma cópia atende aos dois:

```sh
skill_tmp="$(mktemp -d)"
git clone --depth 1 https://github.com/guionardo/guionardofurlan.com.br.git "$skill_tmp/portal"
mkdir -p ~/.claude/skills
cp -R "$skill_tmp/portal/skills/publish-blog-article" ~/.claude/skills/
```

No Claude Code, a skill pode ser chamada como `/publish-blog-article`. No
OpenCode, inicie uma nova sessão e use `@publish-blog-article` ou deixe o
agente selecioná-la pelo contexto. Para instalar somente no projeto, copie a
pasta para `.claude/skills/` (Claude Code) ou `.opencode/skills/` (OpenCode).

Documentação: [skills do Claude Code](https://code.claude.com/docs/en/skills) e
[skills do OpenCode](https://opencode.ai/docs/skills).

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

## Sincronizar a série K3s

Os artigos da série **Homelab Kubernetes** têm como fonte editorial o repositório
`guionardo/guiosoft-k3s-lab`. Para atualizar as versões PT/EN/ES no formato da
collection Astro, mantenha os dois repositórios em checkouts locais e execute:

```sh
python3 scripts/import-k3s-articles.py --source ../guiosoft-k3s-lab
npm run build
```

O importador exige o conjunto completo PT/EN/ES, remove o H1 da fonte porque o
layout Astro já renderiza o título e preserva a data dos artigos existentes.
O catálogo canônico `docs/articles/catalog.json` do repositório fonte define
slugs, `translationKey`, `seriesKey`, ordem, descrições, tags e nomes de destino.
Assim, novos artigos são adicionados ao catálogo sem alterar o código do importador.
Ele apenas altera arquivos locais: não executa commit, push ou deploy.

Para detectar divergência sem escrever arquivos:

```sh
python3 scripts/import-k3s-articles.py --source ../guiosoft-k3s-lab --check
```

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
