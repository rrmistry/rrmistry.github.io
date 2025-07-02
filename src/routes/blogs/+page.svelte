<script lang="ts">
	import { onMount } from 'svelte';
	import type { Blog } from '$lib/blog';
	import BlogList from '$lib/BlogList.svelte';
	import * as Table from '$lib/components/ui/table/index.js';
	import TagBadge from '$lib/components/TagBadge.svelte';
	import { breadcrumbs } from '@/stores/breadcrumb';


	onMount(() => {
		breadcrumbs.set([
			{ href: '/', label: 'Home' },
			{ href: '/blogs', label: 'Blogs' }
		]);

		return () => {
			// Reset to default when component unmounts
			breadcrumbs.set([{ href: '/', label: 'Home' }]);
		};
	});
</script>

<h1><a href="/blogs/">Blog Posts</a></h1>

<BlogList>
	{#snippet row(post: Blog)}
		<Table.Row>
			<Table.Cell class="font-medium">
				<a href="/blogs/{post.slug}">{post.title}</a></Table.Cell
			>
			<Table.Cell>{post.description}</Table.Cell>
			<Table.Cell class="text-right">
				{#each post.tags as tag}
					<TagBadge {tag} class="mr-1" />
				{/each}
			</Table.Cell>
			<Table.Cell class="text-right"
				>{new Intl.DateTimeFormat('en-US', {
					year: 'numeric',
					month: 'short',
					day: 'numeric'
				}).format(new Date(post.date))}</Table.Cell
			>
		</Table.Row>
	{/snippet}
</BlogList>
