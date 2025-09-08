<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import type { BadgeVariant } from '$lib/components/ui/badge/badge.svelte';

	interface Props {
		tag: string;
		variant?: BadgeVariant;
		class?: string;
	}

	let {
		tag,
		variant = 'default',
		class: className = ''
	}: Props = $props();

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
	tabindex={0}
	onkeydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			handleClick(e as any);
		}
	}}
>
	#{tag}
</Badge>
