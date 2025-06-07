import { mdsvex } from "mdsvex";
import staticAdapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeMermaid from 'rehype-mermaid';
import { createHighlighter } from 'shiki';

// Create shiki highlighter
const highlighter = await createHighlighter({
	themes: ['github-light', 'github-dark'],
	langs: ['javascript', 'typescript', 'bash', 'yaml', 'json', 'html', 'css', 'svelte']
});

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: [vitePreprocess({
		allowImportingTsExtensions: true
	}), mdsvex(
		{
			extensions: ['.svx', '.md', '.markdown'],
			highlight: {
				highlighter: (code, lang) => {
					// Generate HTML for light theme
					const lightHtml = highlighter.codeToHtml(code, {
						lang: lang || 'text',
						theme: 'github-light'
					});
					
					// Generate HTML for dark theme
					const darkHtml = highlighter.codeToHtml(code, {
						lang: lang || 'text',
						theme: 'github-dark'
					});
					
					// Extract the pre elements and add appropriate classes
					const lightMatch = lightHtml.match(/<pre[^>]*>([\s\S]*)<\/pre>/);
					const darkMatch = darkHtml.match(/<pre[^>]*>([\s\S]*)<\/pre>/);
					
					if (lightMatch && darkMatch) {
						// Return both themed versions that will be shown/hidden via CSS
						return `<pre class="shiki github-light">${lightMatch[1]}</pre><pre class="shiki github-dark">${darkMatch[1]}</pre>`;
					}
					
					return `<pre><code>${code}</code></pre>`;
				}
			},
			rehypePlugins: [
				[rehypeExternalLinks, { target: '_blank', rel: 'noopener noreferrer' }],
				[rehypeMermaid]
			]
		}
	)],

	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: staticAdapter({
			// default options are shown. On some platforms
			// these options are set automatically — see below
			pages: 'build',
			assets: 'build',
			fallback: '404.html',
			precompress: false,
			strict: true
		}),
		prerender: {
			entries: ['*']
		},
	},

	extensions: [".svelte", ".svx", ".md", ".markdown"]
};

export default config;
