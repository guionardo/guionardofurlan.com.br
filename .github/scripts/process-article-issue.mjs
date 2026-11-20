import { readdir, readFile, writeFile } from 'node:fs/promises';
import { basename, relative, resolve } from 'node:path';

const root = process.env.GITHUB_WORKSPACE || process.cwd();
const body = process.env.ISSUE_BODY || '';
const issueNumber = process.env.ISSUE_NUMBER || 'unknown';
const languages = ['pt', 'en', 'es'];

function fail(message) {
  throw new Error(`Issue #${issueNumber}: ${message}`);
}

const description = body.match(/## Descrição\s*([\s\S]*?)(?=\n## |$)/i)?.[1]
  ?.replace(/<!-- [\s\S]*? -->/g, '').trim();
if (!description) fail('preencha a seção Descrição.');

const destination = body.match(/^\s*(?:destino|destination)\s*:\s*(.+)$/im)?.[1]?.trim();
if (!destination) fail('informe "Destino: blog" ou "Destino: series:<seriesKey>".');

let contentDir = 'src/content/blog';
let seriesKey;
if (destination.toLowerCase().startsWith('series:')) {
  seriesKey = destination.slice(destination.indexOf(':') + 1).trim();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(seriesKey)) fail('seriesKey inválida.');
  const seriesFiles = await readdir(resolve(root, 'src/content/series'));
  if (!seriesFiles.some(file => file.startsWith(`${seriesKey}-`) && file.endsWith('.md'))) {
    fail(`série não encontrada: ${seriesKey}.`);
  }
} else if (destination.toLowerCase() !== 'blog') {
  fail('destino não suportado; use blog ou series:<seriesKey>.');
}

const blockPattern = /^##\s+Artigo\s+(pt|en|es)\s*\r?\n+(\`{4,})[^\n]*\r?\n([\s\S]*?)^\2\s*$/gim;
const articles = new Map();
for (const match of body.matchAll(blockPattern)) {
  const lang = match[1].toLowerCase();
  if (articles.has(lang)) fail(`há mais de um artigo ${lang}.`);
  articles.set(lang, match[3].replace(/^\r?\n/, '').replace(/\r?\n$/, '') + '\n');
}
for (const lang of languages) if (!articles.has(lang)) {
  fail(`inclua o artigo ${lang} em um bloco de código com o título "## Artigo ${lang}".`);
}

function parseFrontmatter(text, lang) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!match) fail(`${lang}: frontmatter YAML ausente ou inválido.`);
  const values = Object.fromEntries([...match[1].matchAll(/^(\w+):\s*(.+?)\s*$/gm)]
    .map(([, key, value]) => [key, value.replace(/^(?:"([\s\S]*)"|'([\s\S]*)')$/, '$1$2')]));
  for (const key of ['title', 'description', 'date', 'slug', 'tags', 'draft', 'lang', 'translationKey']) {
    if (!(key in values)) fail(`${lang}: campo obrigatório ausente: ${key}.`);
  }
  if (values.lang !== lang) fail(`${lang}: lang do frontmatter deve ser ${lang}.`);
  if (values.draft !== 'true') fail(`${lang}: artigos enviados por issue devem usar draft: true.`);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(values.slug)) fail(`${lang}: slug inválido.`);
  if (!/^[a-z0-9][a-z0-9-]*$/.test(values.translationKey)) fail(`${lang}: translationKey inválida.`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(values.date)) fail(`${lang}: date deve usar YYYY-MM-DD.`);
  if (!/^##\s+/m.test(text.slice(match[0].length))) fail(`${lang}: o corpo deve começar com ##, sem H1.`);
  if (seriesKey && values.seriesKey && values.seriesKey !== seriesKey) {
    fail(`${lang}: seriesKey do frontmatter não corresponde ao destino.`);
  }
  return { values, header: match[1] };
}

const loaded = new Map();
for (const [lang, text] of articles) {
  if (text.length > 1_000_000) fail(`${lang}: artigo excede 1 MiB.`);
  loaded.set(lang, { text, parsed: parseFrontmatter(text, lang) });
}

const keys = new Set([...loaded.values()].map(({ parsed }) => parsed.values.translationKey));
if (keys.size !== 1) fail('os três artigos precisam compartilhar a mesma translationKey.');
const translationKey = [...keys][0];
const seenSlugs = new Set();
for (const [lang, { parsed }] of loaded) {
  const slug = parsed.values.slug;
  if (seenSlugs.has(slug)) fail(`slug duplicado entre idiomas: ${slug}.`);
  seenSlugs.add(slug);
  const target = resolve(root, contentDir, basename(slug) + `.${lang}.md`);
  if (!target.startsWith(resolve(root, contentDir) + '/')) fail('caminho de destino inválido.');
  try {
    await readFile(target);
    fail(`o arquivo já existe: ${relative(root, target)}.`);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}

for (const [lang, { text, parsed }] of loaded) {
  let output = text;
  if (seriesKey && !/^seriesKey:/m.test(parsed.header)) {
    output = output.replace(/^---\r?\n([\s\S]*?)\r?\n---/, `---\n${parsed.header}\nseriesKey: ${seriesKey}\n---`);
  }
  const filename = `${parsed.values.slug}.${lang}.md`;
  await writeFile(resolve(root, contentDir, filename), output);
}

console.log(`Validated ${languages.length} article languages for ${translationKey}.`);
