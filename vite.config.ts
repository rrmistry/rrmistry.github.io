import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import path from 'path';

export default defineConfig({
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
