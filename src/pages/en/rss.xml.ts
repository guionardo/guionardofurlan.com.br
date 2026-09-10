import rss from '@astrojs/rss';
import { getPosts } from '../../lib/content';
export async function GET() {
  const posts = await getPosts('en');
  return rss({ title: 'Guionardo Furlan — Blog', description: 'Articles and lessons from Guionardo Furlan.', site: 'https://guionardofurlan.com.br', customData: '<language>en</language>', items: posts.map(({ data }) => ({ title: data.title, description: data.description, pubDate: data.date, link: `/en/blog/${data.slug}/` })) });
}
