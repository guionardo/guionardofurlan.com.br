import { getCollection } from 'astro:content';
import { languages, locale, prefix, type Language } from './i18n';

// O restante do portal depende desta interface; outros formatos podem ser
// normalizados aqui no futuro sem alterar as URLs públicas.
export async function getPosts(lang: Language = 'pt') {
  const posts = await getCollection('blog', ({ data }) => !data.draft && data.lang === lang);
  const slugs = new Set<string>();
  const keys = new Set<string>();
  const seriesOrders = new Set<string>();
  for (const post of posts) {
    if (slugs.has(post.data.slug)) throw new Error(`Slug duplicado: ${post.data.slug}`);
    slugs.add(post.data.slug);
    if (post.data.translationKey) {
      if (keys.has(post.data.translationKey)) throw new Error(`Chave de tradução duplicada: ${post.data.translationKey}`);
      keys.add(post.data.translationKey);
    }
    if (post.data.seriesKey) {
      if (post.data.seriesOrder === undefined) {
        throw new Error(`Artigo "${post.data.slug}" tem seriesKey sem seriesOrder`);
      }
      const orderKey = `${post.data.seriesKey}:${post.data.seriesOrder}`;
      if (seriesOrders.has(orderKey)) throw new Error(`Série ${post.data.seriesKey}: ordem ${post.data.seriesOrder} duplicada`);
      seriesOrders.add(orderKey);
    }
  }
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export const seriesKeyFromId = (id: string) => id.replace(/-(pt|en|es)$/, '');

export async function getSeries(lang: Language = 'pt') {
  const all = await getCollection('series');
  return all.filter(s => s.data.lang === lang);
}

export async function getSeriesEntry(key: string, lang: Language = 'pt') {
  const all = await getCollection('series');
  return all.find(s => s.id === `${key}-${lang}`) ?? null;
}

export async function getSeriesPosts(key: string, lang: Language = 'pt') {
  return (await getPosts(lang))
    .filter(p => p.data.seriesKey === key)
    .sort((a, b) => (a.data.seriesOrder ?? 0) - (b.data.seriesOrder ?? 0));
}

export async function getResume(lang: Language = 'pt') {
  const all = await getCollection('resume');
  return all.find(r => r.data.lang === lang) ?? null;
}

export const formatDate = (date: Date, lang: Language = 'pt') => new Intl.DateTimeFormat(locale[lang], {
  day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
}).format(date);

export async function getTranslations(post: Awaited<ReturnType<typeof getPosts>>[number]) {
  const translations: Partial<Record<Language, string>> = {
    [post.data.lang]: `${prefix(post.data.lang)}/blog/${post.data.slug}/`,
  };
  if (!post.data.translationKey) return translations;
  for (const lang of languages) {
    const match = (await getPosts(lang)).find(item => item.data.translationKey === post.data.translationKey);
    if (match) translations[lang] = `${prefix(lang)}/blog/${match.data.slug}/`;
  }
  return translations;
}
