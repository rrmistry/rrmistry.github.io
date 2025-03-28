<script lang="ts">
	import { onMount } from 'svelte';
	import type { Blog } from './blog';
	import { Input } from '$lib/components/ui/input/index.ts';
	import * as Sidebar from '$lib/components/ui/sidebar/index.ts';
	import type { Snippet } from 'svelte';

	interface Props {
		row: Snippet<[Blog]>;
	}
	let { row, ...restProps }: Props = $props();

	let searchTerm = $state('');
	let posts = $state([]);
	let filteredPosts = $state([]);

	// // Update the prop definition to allow both string and component types
	// export let itemComponent: string = 'li';

	onMount(async () => {
		const res = await fetch('/api/posts');
		posts = await res.json();
		filteredPosts = posts;
	});

	function search() {
		console.debug(`Search for: ${searchTerm}`);
		if (searchTerm.startsWith('tag:')) {
			const tag = searchTerm.slice(4).trim();
			if (tag) {
				filteredPosts = posts.filter(
					(post) =>
						post.tags &&
						post.tags.some((t) => t.toLowerCase().includes(tag.toLowerCase()))
				);
			} else {
				filteredPosts = posts;
			}
		} else {
			const term = searchTerm.toLowerCase().trim();
			if (term && term.length > 0) {
				filteredPosts = posts.filter(
					(post) => post.title && post.title.toLowerCase().includes(term)
				);
			} else {
				filteredPosts = posts;
			}
		}
	}
</script>

<Input
	bind:value={searchTerm}
	oninput={search}
	onchange={search}
	placeholder="Search title or use tag:tagname"
/>

{#each filteredPosts as post}
	{@render row(post)}
{/each}
