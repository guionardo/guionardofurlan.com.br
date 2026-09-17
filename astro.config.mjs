import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mermaid from 'astro-mermaid';

export default defineConfig({
  site: 'https://guionardofurlan.com.br',
  trailingSlash: 'always',
  integrations: [mermaid(), sitemap()],
});
