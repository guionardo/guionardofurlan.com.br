import rss from '@astrojs/rss';
import { getPosts } from '../lib/content';
export async function GET() {
  const posts = await getPosts();
  return rss({ title: 'Guionardo Furlan — Blog', description: 'Artigos e aprendizados de Guionardo Furlan.', site: 'https://guionardofurlan.com.br', customData: '<language>pt-br</language>', items: posts.map(({ data }) => ({ title: data.title, description: data.description, pubDate: data.date, link: `/blog/${data.slug}/` })) });
}
