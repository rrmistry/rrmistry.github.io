<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { goto } from '$app/navigation';
	import type { ComponentProps } from 'svelte';
	import type { BadgeVariant } from '$lib/components/ui/badge/badge.svelte';

	interface TagBadgeProps extends Omit<ComponentProps<Badge>, 'href' | 'onclick'> {
		tag: string;
		variant?: BadgeVariant;
		class?: string;
	}

	let {
		tag,
		variant = 'default',
		class: className,
		children,
		...restProps
	}: TagBadgeProps = $props();

	function handleClick(e: MouseEvent) {
		e.preventDefault();
		window.location.href = `/blogs?tag=${encodeURIComponent(tag)}`;
	}
</script>

<Badge
	{variant}
	class="cursor-pointer {className}"
	onclick={handleClick}
	role="link"
	tabindex="0"
	onkeydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			handleClick(e as any);
		}
	}}
	{...restProps}
>
	{#if children}
		{@render children()}
	{:else}
		#{tag}
	{/if}
</Badge>
