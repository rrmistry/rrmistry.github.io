<script>
	import { page } from '$app/state';

	import Print from '$lib/PrintButton.svelte';
	import Blog from '$lib/BlogButton.svelte';

	import { onMount } from 'svelte';
	let isScrolled = false;

	onMount(() => {
		const onScroll = () => {
			isScrolled = window.scrollY > 50;
		};
		window.addEventListener('scroll', onScroll);
		return () => window.removeEventListener('scroll', onScroll);
	});

	let url = page.url.pathname;
</script>

<nav
	class="no-print fixed top-0 z-50 w-full transition-all duration-300 ease-in-out"
	class:hidden={!isScrolled}
	class:bg-primary={isScrolled}
	class:shadow-lg={isScrolled}
>
	<div class="container mx-auto flex items-center justify-between px-4 py-3">
		<div class="text-xl font-bold text-white">Rohit Mistry</div>
		{#if url === '/resume'}
			<Print />
		{:else}
			<Blog />
		{/if}
	</div>
</nav>
