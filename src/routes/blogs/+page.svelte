<script lang="ts">
	import { onMount } from 'svelte';
	import type { Blog } from '$lib/blog';
	import BlogList from '$lib/BlogList.svelte';
	import TagBadge from '$lib/components/TagBadge.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import { breadcrumbs } from '../../stores/breadcrumb';

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

<div class="max-w-4xl mx-auto px-4 py-8">
	<div class="mb-8 p-8 rounded-2xl bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 dark:from-emerald-950/20 dark:via-blue-950/20 dark:to-purple-950/20 border border-gradient-to-r border-emerald-200/50 dark:border-emerald-800/50">
		<h1 class="text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
			<a href="/blogs/" class="hover:from-emerald-500 hover:via-blue-500 hover:to-purple-500 transition-all duration-200">
				Blog Posts
			</a>
		</h1>
		<p class="text-muted-foreground text-lg bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent dark:from-slate-300 dark:to-slate-400">
			Real-world solutions and insights from building cloud-native systems
		</p>
	</div>

	<BlogList>
		{#snippet row(post: Blog)}
			<Card.Root class="group relative overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:shadow-purple-500/10 hover:border-purple-400/20 bg-gradient-to-br from-background to-slate-50/20 dark:from-background dark:to-slate-900/20 hover:from-purple-50/20 hover:to-blue-50/10 dark:hover:from-purple-950/10 dark:hover:to-blue-950/5">
				<Card.Header class="pb-3">
					<div class="flex items-start justify-between gap-4 mb-2">
						<Card.Title class="text-xl leading-tight flex-1 min-w-0">
							<a href="/blogs/{post.slug}" 
							   class="text-foreground transition-all duration-200 hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-600 hover:bg-clip-text hover:text-transparent">
								{post.title}
							</a>
						</Card.Title>
						<time class="text-sm text-muted-foreground font-medium shrink-0" 
							  datetime={post.date}>
							{new Intl.DateTimeFormat('en-US', {
								year: 'numeric',
								month: 'short',
								day: 'numeric',
								timeZone: 'UTC'
							}).format(new Date(post.date))}
						</time>
					</div>
					<Card.Description class="leading-relaxed">
						{post.description}
					</Card.Description>
				</Card.Header>
				
				{#if post.tags && post.tags.length > 0}
					<Card.Footer class="pt-0">
						<div class="flex flex-wrap gap-2">
							{#each post.tags as tag}
								<TagBadge {tag} class="text-xs" />
							{/each}
						</div>
					</Card.Footer>
				{/if}
			</Card.Root>
		{/snippet}
	</BlogList>
</div>
