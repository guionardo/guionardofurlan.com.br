import { getCollection } from 'astro:content';

// O restante do portal depende desta interface; outros formatos podem ser
// normalizados aqui no futuro sem alterar as URLs públicas.
export async function getPosts(lang: 'pt' | 'en' = 'pt') {
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

export const formatDate = (date: Date, lang: 'pt' | 'en' = 'pt') => new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : 'pt-BR', {
  day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
}).format(date);

export async function getTranslation(post: Awaited<ReturnType<typeof getPosts>>[number]) {
  if (!post.data.translationKey) return null;
  const lang = post.data.lang === 'en' ? 'pt' : 'en';
  const match = (await getPosts(lang)).find(item => item.data.translationKey === post.data.translationKey);
  return match ? `${lang === 'en' ? '/en' : ''}/blog/${match.data.slug}/` : null;
}
