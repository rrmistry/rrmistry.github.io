<script lang="ts">
	import '../app.css';
	let { children } = $props();
	import Navbar from '$lib/Navbar.svelte';
</script>

<Navbar />

<article class="prose max-w-screen-lg justify-self-center m-8">
	{@render children()}
</article>
