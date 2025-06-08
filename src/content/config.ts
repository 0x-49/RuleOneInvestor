import { z, defineCollection } from "astro:content";

// Define schema for blog posts collection
const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    image: z.string(),
    category: z.string(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    readingTime: z.number().optional(),
    author: z.object({
      name: z.string(),
      title: z.string().optional(),
      image: z.string().optional(),
    }),
    relatedPosts: z.array(z.string()).optional(),
  }),
});

export const collections = {
  'blog': blogCollection,
};
