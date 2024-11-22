import aspectRatio from '@tailwindcss/aspect-ratio';
import containerQueries from '@tailwindcss/container-queries';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			// Color reference: https://tailwindcss.com/docs/customizing-colors
			colors: {
				primary: {
					light: '#3b82f6', // blue-500
					DEFAULT: '#2563eb', // blue-600
					dark: '#1e40af' // blue-800
				},
				secondary: {
					light: '#34d399', // green-400
					DEFAULT: '#10b981', // green-500
					dark: '#047857' // green-700
				}
			}
		}
	},

	plugins: [typography, forms, containerQueries, aspectRatio]
} satisfies Config;
