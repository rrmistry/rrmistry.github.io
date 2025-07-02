<script lang="ts">
	export let data;
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	const { post: Post, metadata } = data;
	import { Badge } from '$lib/components/ui/badge/index.js';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { breadcrumbs } from '@/stores/breadcrumb';

	onMount(() => {
		const slug = $page.params.slug;
		breadcrumbs.set([
			{ href: '/', label: 'Home' },
			{ href: '/blogs', label: 'Blogs' },
			{ href: `/blogs/${slug}`, label: metadata.title }
		]);

		return () => {
			// Reset to default when component unmounts
			breadcrumbs.set([{ href: '/', label: 'Home' }]);
		};
	});
</script>

<h1>{metadata.title}</h1>

<div class="flex justify-between text-sm">
	<div class="flex gap-2">
		Tags: {#each metadata.tags as tag}
			<Badge class="mr-1">#{tag}</Badge>
		{/each}
	</div>
	<div>
		Date: {new Intl.DateTimeFormat('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		}).format(new Date(metadata.date))}
	</div>
</div>

<Separator class="mt-4" />

<svelte:component this={Post} />
