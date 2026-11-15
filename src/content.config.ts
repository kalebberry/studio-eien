import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const work = defineCollection({
	loader: glob({ pattern: '**/*.mdx', base: './src/content/work' }),
	schema: z.object({
		title: z.string(),
		japaneseTitle: z.string(),
		subtitle: z.string(),
		tagline: z.string(),
		client: z.string(),
		year: z.string(),
		roles: z.array(z.string()),
		deliverables: z.array(z.string()),
		heroImage: z.string(),
		heroImageAlt: z.string(),
		order: z.number().default(1),
		accentColor: z.string().optional(),
		liveUrl: z.string().optional(),
		nextProject: z
			.object({
				slug: z.string(),
				title: z.string(),
				tagline: z.string(),
				thumbnail: z.string(),
			})
			.optional(),
	}),
});

export const collections = {
	work,
};
