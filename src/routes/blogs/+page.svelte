<script lang="ts">
	import { onMount } from 'svelte';
	import type { Blog } from '$lib/blog';
	import BlogList from '$lib/BlogList.svelte';
	import TagBadge from '$lib/components/TagBadge.svelte';
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
	<div class="mb-8">
		<h1 class="text-4xl font-bold tracking-tight mb-2">
			<a href="/blogs/" class="text-foreground hover:text-primary transition-colors">
				Blog Posts
			</a>
		</h1>
		<p class="text-muted-foreground text-lg">
			Thoughts, insights, and learnings from my journey in software development
		</p>
	</div>

	<BlogList>
		{#snippet row(post: Blog)}
			<article class="group bg-card border rounded-lg p-6 mb-4 hover:shadow-md transition-all duration-200 hover:border-primary/20">
				<div class="flex flex-col space-y-3">
					<div class="flex items-start justify-between gap-4">
						<div class="flex-1 min-w-0">
							<h2 class="text-xl font-semibold leading-tight mb-2">
								<a href="/blogs/{post.slug}" 
								   class="text-foreground hover:text-primary transition-colors group-hover:text-primary">
									{post.title}
								</a>
							</h2>
							<p class="text-muted-foreground leading-relaxed">
								{post.description}
							</p>
						</div>
						<time class="text-sm text-muted-foreground font-medium shrink-0 mt-1" 
							  datetime={post.date}>
							{new Intl.DateTimeFormat('en-US', {
								year: 'numeric',
								month: 'short',
								day: 'numeric'
							}).format(new Date(post.date))}
						</time>
					</div>
					
					{#if post.tags && post.tags.length > 0}
						<div class="flex flex-wrap gap-2 pt-2">
							{#each post.tags as tag}
								<TagBadge {tag} class="text-xs" />
							{/each}
						</div>
					{/if}
				</div>
			</article>
		{/snippet}
	</BlogList>
</div>
