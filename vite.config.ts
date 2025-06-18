import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import path from 'path';

export default defineConfig({
	server: {
		port: 5173
	},
	preview: {
		port: 5173
	},

	plugins: [sveltekit()],

	resolve: {
		alias: {
			// '@': '/src'
			'@': path.resolve(__dirname, 'src')
		}
	},

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
