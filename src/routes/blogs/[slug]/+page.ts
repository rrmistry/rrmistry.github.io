import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const slug = params.slug;
	try {
		const post = await import(`@/content/${slug}.md`);
		return {
			post: post.default,
			metadata: post.metadata
		};
	} catch (e: unknown) {
		throw error(404, `Not found: ${e}`);
	}
}

export const entries = async () => {
	const modules = import.meta.glob('/src/content/*.md');
	const slugs = Object.keys(modules).map((path) =>
		path.replace('/src/content/', '').replace('.md', '')
	);
	return slugs.map((slug) => ({ slug }));
};
