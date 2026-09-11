import { getCollection } from 'astro:content';
import { languages, locale, prefix, type Language } from './i18n';

// O restante do portal depende desta interface; outros formatos podem ser
// normalizados aqui no futuro sem alterar as URLs públicas.
export async function getPosts(lang: Language = 'pt') {
  const posts = await getCollection('blog', ({ data }) => !data.draft && data.lang === lang);
  const slugs = new Set<string>();
  const keys = new Set<string>();
  for (const post of posts) {
    if (slugs.has(post.data.slug)) throw new Error(`Slug duplicado: ${post.data.slug}`);
    slugs.add(post.data.slug);
    if (post.data.translationKey) {
      if (keys.has(post.data.translationKey)) throw new Error(`Chave de tradução duplicada: ${post.data.translationKey}`);
      keys.add(post.data.translationKey);
    }
  }
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
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
