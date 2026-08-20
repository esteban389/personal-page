import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  // Load Markdown and MDX files in the `src/content/posts/` directory.
  loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' }),
  // Type-check frontmatter using a schema
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      // Transform string to Date object
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      heroImage: z.optional(image()),
      focusEffect: z.literal('scroll-dark').optional(),
      category: z.string().optional(),
      lang: z.enum(['en', 'es']).default('en'),
      translationKey: z.string().optional(),
      homeFeatured: z.boolean().default(false),
      homeHeroOrder: z.number().int().positive().optional(),
      homeOrder: z.number().int().positive().optional(),
      draft: z.boolean().default(false),
      syndication: z
        .object({
          dev: z
            .object({
              tags: z.array(z.string().min(1)).min(1).max(4),
              series: z.string().min(1).optional(),
              articleId: z.number().int().positive().optional(),
            })
            .optional(),
          medium: z
            .object({
              topics: z.array(z.string().min(1)).min(1).max(5),
            })
            .optional(),
        })
        .optional(),
    }),
});

export const collections = { posts };
