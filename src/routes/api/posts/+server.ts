import { json } from '@sveltejs/kit';

export async function GET() {
	const modules = import.meta.glob('/src/content/*.md');
	const posts = await Promise.all(
		Object.entries(modules).map(async ([path, module]) => {
			const { metadata } = await module();
			const slug = path.replace('/src/content/', '').replace('.md', '');
			return { slug, ...metadata };
		})
	);
	return json(posts);
}

export const prerender = true;
