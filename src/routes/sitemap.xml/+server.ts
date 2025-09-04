
import { json } from '@sveltejs/kit';

export async function GET({ url }) {
	const modules = import.meta.glob('/src/content/*.md');
	const posts = await Promise.all(
		Object.entries(modules).map(async ([path, module]) => {
			const { metadata } = await module();
			const slug = path.replace('/src/content/', '').replace('.md', '');
			return { slug, ...metadata };
		})
	);

	const headers = {
		'Cache-Control': 'max-age=0, s-maxage=3600',
		'Content-Type': 'application/xml'
	};

	const sitemap = `<?xml version="1.0" encoding="UTF-8" ?>
<urlset
  xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="https://www.w3.org/1999/xhtml"
  xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
  xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
  xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
  xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
>
  <url>
    <loc>${url.origin}</loc>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${url.origin}/about</loc>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${url.origin}/blogs</loc>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${url.origin}/resume</loc>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>
  ${posts
		.map(
			(post) => `
  <url>
    <loc>${url.origin}/blogs/${post.slug}</loc>
    <changefreq>weekly</changefreq>
    <lastmod>${post.date}</lastmod>
    <priority>0.3</priority>
  </url>
  `
		)
		.join('')}
</urlset>`;

	return new Response(sitemap, { headers });
}

