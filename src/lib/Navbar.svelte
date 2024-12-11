<script>
	import Print from '$lib/Print.svelte';

	import { onMount } from 'svelte';
	let isScrolled = false;

	onMount(() => {
		const onScroll = () => {
			isScrolled = window.scrollY > 50;
		};
		window.addEventListener('scroll', onScroll);
		return () => window.removeEventListener('scroll', onScroll);
	});
</script>

<nav
	class="no-print fixed top-0 z-50 w-full transition-all duration-300 ease-in-out"
	class:hidden={!isScrolled}
	class:bg-primary={isScrolled}
	class:shadow-lg={isScrolled}
>
	<div class="container mx-auto flex items-center justify-between px-4 py-3">
		<div class="text-xl font-bold text-white">Rohit Mistry - Cloud / Data Architect</div>
		<Print />
	</div>
</nav>

<style>
	.from-transparent {
		background-color: transparent;
	}
</style>
