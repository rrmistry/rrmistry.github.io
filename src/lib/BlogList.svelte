<script lang="ts">
	import { onMount } from 'svelte';
	import type { Blog } from './blog';
	import { Input } from '$lib/components/ui/input/index.ts';
	import * as Sidebar from '$lib/components/ui/sidebar/index.ts';
	import type { Snippet } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { X } from 'lucide-svelte';

	interface Props {
		row: Snippet<[Blog]>;
		limit?: number;
		hideSearch?: boolean;
		variant?: 'default' | 'sidebar';
	}
	let { row, limit, hideSearch = false, variant = 'default', ...restProps }: Props = $props();

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

	function clearSearch() {
		searchTerm = '';
		search();
	}
</script>

{#if !hideSearch}
	<div class="mb-6">
		<div class="relative w-full">
			<Input
				bind:value={searchTerm}
				oninput={search}
				onchange={search}
				placeholder="Search by title or use tag:tagname..."
				class="pr-10"
			/>
			{#if searchTerm}
				<button
					type="button"
					onclick={clearSearch}
					class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-sm hover:bg-muted"
					aria-label="Clear search"
				>
					<X class="h-4 w-4" />
				</button>
			{/if}
		</div>
	</div>
{/if}

<div class={variant === 'sidebar' ? 'space-y-2' : 'space-y-6'}>
	{#each filteredPosts as post}
		{#if variant === 'sidebar'}
			<div class="bg-card border rounded-md p-3 hover:shadow-sm transition-all duration-200 hover:border-primary/20 group">
				<a href="/blogs/{post.slug}" data-sveltekit-reload class="block w-full">
					<div class="flex flex-col space-y-2">
						<span class="line-clamp-2 text-sm font-medium leading-tight text-foreground group-hover:text-primary transition-colors">
							{post.title}
						</span>
						<time class="text-xs text-muted-foreground" datetime={post.date}>
							{new Intl.DateTimeFormat('en-US', {
								month: 'short',
								day: 'numeric',
								year: 'numeric',
								timeZone: 'UTC'
							}).format(new Date(post.date))}
						</time>
					</div>
				</a>
			</div>
		{:else}
			{@render row(post)}
		{/if}
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
