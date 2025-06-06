import { mdsvex } from "mdsvex";
import staticAdapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeMermaid from 'rehype-mermaid';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: [vitePreprocess({
		allowImportingTsExtensions: true
	}), mdsvex(
		{
			extensions: ['.svx', '.md', '.markdown'],
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
