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
		limit?: number;
		hideSearch?: boolean;
	}
	let { row, limit, hideSearch = false, ...restProps }: Props = $props();

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
		const fetchedPosts = await res.json();
		
		// Sort posts by date in reverse chronological order (newest first)
		posts = fetchedPosts.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
		
		// Apply initial search if exists
		if (searchTerm) {
			search();
		} else {
			filteredPosts = limit ? posts.slice(0, limit) : posts;
		}
	});

	function search() {
		console.debug(`Search for: ${searchTerm}`);
		if (searchTerm.startsWith('tag:')) {
			const tag = searchTerm.slice(4).trim();
			if (tag) {
				const filtered = posts.filter(
					(post) =>
						post.tags &&
						post.tags.some((t) => t.toLowerCase().includes(tag.toLowerCase()))
				);
				filteredPosts = limit ? filtered.slice(0, limit) : filtered;
			} else {
				filteredPosts = limit ? posts.slice(0, limit) : posts;
			}
		} else {
			const term = searchTerm.toLowerCase().trim();
			if (term && term.length > 0) {
				const filtered = posts.filter(
					(post) => post.title && post.title.toLowerCase().includes(term)
				);
				filteredPosts = limit ? filtered.slice(0, limit) : filtered;
			} else {
				filteredPosts = limit ? posts.slice(0, limit) : posts;
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

{#if !hideSearch}
	<div class="mb-6">
		<Input
			bind:value={searchTerm}
			oninput={search}
			onchange={search}
			placeholder="Search by title or use tag:tagname..."
			class="max-w-md"
		/>
	</div>
{/if}

<div class="space-y-0">
	{#each filteredPosts as post}
		{@render row(post)}
	{/each}
</div>

{#if filteredPosts.length === 0 && searchTerm}
	<div class="text-center py-12">
		<div class="text-muted-foreground">
			<p class="text-lg mb-2">No posts found</p>
			<p class="text-sm">Try a different search term or <button class="text-primary hover:underline" onclick={() => { searchTerm = ''; search(); }}>clear the search</button></p>
		</div>
	</div>
{:else if filteredPosts.length === 0}
	<div class="text-center py-12">
		<div class="text-muted-foreground">
			<p class="text-lg">No blog posts available</p>
		</div>
	</div>
{/if}
