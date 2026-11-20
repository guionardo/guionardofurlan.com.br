import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { basename, join, relative, resolve } from 'node:path';

const root = process.env.GITHUB_WORKSPACE || process.cwd();
const body = process.env.ISSUE_BODY || '';
const issueNumber = process.env.ISSUE_NUMBER || 'unknown';
const languages = ['pt', 'en', 'es'];
const attachmentSection = body.match(/## Arquivos anexos([\s\S]*?)(?=\n## |$)/i)?.[1] || '';
const links = [...attachmentSection.matchAll(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g)]
  .map(([, name, url]) => ({ name: basename(name.trim()), url }));

for (const { url } of links) {
  const host = new URL(url).hostname;
  if (host !== 'github.com' && !host.endsWith('.github.com') && !host.endsWith('.githubusercontent.com') && !host.endsWith('.githubassets.com')) {
    fail('todos os anexos devem usar URLs do GitHub.');
  }
}

function fail(message) {
  throw new Error(`Issue #${issueNumber}: ${message}`);
}

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

if (links.length < 3) fail('anexe os três arquivos Markdown na seção Arquivos anexos.');
const articles = new Map();
for (const attachment of links) {
  const match = attachment.name.match(/^(.+)\.(pt|en|es)\.md$/i);
  if (match) {
    const lang = match[2].toLowerCase();
    if (articles.has(lang)) fail(`há mais de um artigo ${lang}.`);
    articles.set(lang, { ...attachment, filename: attachment.name, lang });
  }
}
for (const lang of languages) if (!articles.has(lang)) fail(`falta o artigo ${lang} (.${lang}.md).`);

function frontmatter(text, lang) {
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
  if (!/^\d{4}-\d{2}-\d{2}$/.test(values.date.replaceAll('"', '').replaceAll("'", ''))) fail(`${lang}: date deve usar YYYY-MM-DD.`);
  if (!/^##\s+/m.test(text.slice(match[0].length))) fail(`${lang}: o corpo deve começar com ##, sem H1.`);
  return { values, body: text.slice(match[0].length) };
}

const loaded = new Map();
for (const [lang, article] of articles) {
  const response = await fetch(article.url, { headers: { 'User-Agent': 'github-actions-article-proposal' } });
  if (!response.ok) fail(`não foi possível baixar ${article.filename}: HTTP ${response.status}.`);
  const text = await response.text();
  if (text.length > 1_000_000) fail(`${article.filename} excede 1 MiB.`);
  loaded.set(lang, { article, text, parsed: frontmatter(text, lang) });
}

const keys = new Set([...loaded.values()].map(({ parsed }) => parsed.values.translationKey));
if (keys.size !== 1) fail('os três artigos precisam compartilhar a mesma translationKey.');
const translationKey = [...keys][0];
const seenSlugs = new Set();
for (const { parsed } of loaded.values()) {
  const slug = parsed.values.slug;
  if (seenSlugs.has(slug)) fail(`slug duplicado entre idiomas: ${slug}.`);
  seenSlugs.add(slug);
  const target = resolve(root, contentDir, basename(parsed.values.slug) + `.${parsed.values.lang}.md`);
  if (!target.startsWith(resolve(root, contentDir) + '/')) fail('caminho de destino inválido.');
  try { await readFile(target); fail(`o arquivo já existe: ${relative(root, target)}.`); } catch (error) { if (error.code !== 'ENOENT') throw error; }
}

const imageFiles = [];
for (const attachment of links) {
  if (/\.(?:png|jpe?g|gif|webp|svg)$/i.test(attachment.name)) imageFiles.push(attachment);
}
const attachmentNames = new Set();
for (const { name } of links) {
  if (attachmentNames.has(name)) fail(`nome de anexo repetido: ${name}.`);
  attachmentNames.add(name);
}
const imageDir = join(root, 'public/images', translationKey);
await mkdir(resolve(root, contentDir), { recursive: true });
await mkdir(imageDir, { recursive: true });
const imagePaths = new Map();
const attachmentDir = join(root, 'public/attachments', translationKey);
await mkdir(attachmentDir, { recursive: true });
for (const image of imageFiles) {
  const filename = basename(image.name);
  const response = await fetch(image.url, { headers: { 'User-Agent': 'github-actions-article-proposal' } });
  if (!response.ok) fail(`não foi possível baixar a imagem ${filename}: HTTP ${response.status}.`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length > 10_000_000) fail(`a imagem ${filename} excede 10 MiB.`);
  await writeFile(join(imageDir, filename), bytes);
  imagePaths.set(filename, `/images/${translationKey}/${filename}`);
}
for (const attachment of links.filter(({ name }) => !/\.md$/i.test(name) && !imagePaths.has(basename(name)))) {
  const filename = basename(attachment.name);
  const response = await fetch(attachment.url, { headers: { 'User-Agent': 'github-actions-article-proposal' } });
  if (!response.ok) fail(`não foi possível baixar o anexo ${filename}: HTTP ${response.status}.`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length > 10_000_000) fail(`o anexo ${filename} excede 10 MiB.`);
  await writeFile(join(attachmentDir, filename), bytes);
  imagePaths.set(filename, `/attachments/${translationKey}/${filename}`);
}

for (const { article, parsed } of loaded.values()) {
  let text = parsed.body;
  for (const [filename, path] of imagePaths) text = text.replaceAll(`](${filename})`, `](${path})`);
  const values = parsed.values;
  const frontmatterLines = [
    '---', `title: ${values.title}`, `description: ${values.description}`, `date: ${values.date}`,
    `slug: ${values.slug}`, `tags: ${values.tags}`, 'draft: true', `lang: ${values.lang}`,
    `translationKey: ${translationKey}`,
    ...(seriesKey ? [`seriesKey: ${seriesKey}`] : []), '---', '',
  ];
  const filename = `${values.slug}.${values.lang}.md`;
  await writeFile(join(root, contentDir, filename), frontmatterLines.join('\n') + text);
}
