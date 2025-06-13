<script lang="ts">
	import { onMount } from 'svelte';
	import type { Blog } from './blog';
	import { Input } from '$lib/components/ui/input/index.ts';
	import * as Sidebar from '$lib/components/ui/sidebar/index.ts';
	import type { Snippet } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

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
		// Read URL params on client side
		if (typeof window !== 'undefined') {
			const urlParams = new URLSearchParams(window.location.search);
			const query = urlParams.get('q') || '';
			const tag = urlParams.get('tag') || '';
			searchTerm = tag ? `tag:${tag}` : query;
		}
		
		const res = await fetch('/api/posts');
		posts = await res.json();
		
		// Apply initial search if exists
		if (searchTerm) {
			search();
		} else {
			filteredPosts = posts;
		}
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
		
		// Update URL with current search term
		if ($page.url.pathname === '/blogs') {
			const url = new URL($page.url);
			
			// Clear both parameters first
			url.searchParams.delete('q');
			url.searchParams.delete('tag');
			
			if (searchTerm) {
				if (searchTerm.startsWith('tag:')) {
					const tagValue = searchTerm.slice(4).trim();
					if (tagValue) {
						url.searchParams.set('tag', tagValue);
					}
				} else {
					url.searchParams.set('q', searchTerm);
				}
			}
			
			goto(url, { replaceState: true, keepFocus: true });
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
