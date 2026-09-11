import rss from '@astrojs/rss';
import { getPosts } from '../../lib/content';
export async function GET() {
  const posts = await getPosts('es');
  return rss({ title: 'Guionardo Furlan — Blog', description: 'Artículos y aprendizajes de Guionardo Furlan.', site: 'https://guionardofurlan.com.br', customData: '<language>es</language>', items: posts.map(({ data }) => ({ title: data.title, description: data.description, pubDate: data.date, link: `/es/blog/${data.slug}/` })) });
}
