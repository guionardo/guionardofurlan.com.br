import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod'

export const collections = {
  blog: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
    schema: z.object({
      lang: z.enum(['pt', 'en']).default('pt'),
      translationKey: z.string().optional(),
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(true),
    }),
  }),
};
