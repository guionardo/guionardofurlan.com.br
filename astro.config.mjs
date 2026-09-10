import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://guionardofurlan.com.br',
  trailingSlash: 'always',
  integrations: [sitemap()],
});
