<script lang="ts">
	import { onMount } from 'svelte';
	import mermaid from 'mermaid';
	import { mode } from 'mode-watcher';

	export let chart: string;
	export let id: string = `mermaid-${Math.random().toString(36).substr(2, 9)}`;

	let chartElement: HTMLDivElement;
	let currentTheme: string | null = null;
	let renderedId: string | null = null;

	// Function to render the mermaid chart with current theme
	async function renderChart() {
		if (!chartElement) return;
		
		const theme = $mode === 'dark' ? 'dark' : 'default';
		
		// Force re-render on theme change
		if (theme !== currentTheme) {
			currentTheme = theme;
			
			// Clear the previous content
			chartElement.innerHTML = '';
			
			// Generate a new ID for this render to avoid conflicts
			renderedId = `${id}-${Date.now()}`;
			
			mermaid.initialize({ 
				startOnLoad: false,
				theme: theme,
				securityLevel: 'loose',
				themeVariables: {
					darkMode: theme === 'dark'
				}
			});

			try {
				const { svg } = await mermaid.render(renderedId, chart);
				chartElement.innerHTML = svg;
			} catch (error) {
				console.error('Error rendering mermaid chart:', error);
				// If rendering fails, it might be due to a duplicate ID
				// Try again with a new ID
				try {
					renderedId = `${id}-retry-${Date.now()}`;
					const { svg } = await mermaid.render(renderedId, chart);
					chartElement.innerHTML = svg;
				} catch (retryError) {
					console.error('Retry failed:', retryError);
					chartElement.innerHTML = `<p>Error rendering diagram: ${retryError}</p>`;
				}
			}
		}
	}

	onMount(() => {
		renderChart();
		
		// No cleanup needed as we're using unique IDs
	});

	// Re-render when theme changes
	$: if (chartElement && $mode !== undefined) {
		renderChart();
	}
</script>

<div bind:this={chartElement} class="mermaid-chart my-4 flex justify-center"></div>

<style>
	.mermaid-chart :global(svg) {
		max-width: 100%;
		height: auto;
	}
</style>