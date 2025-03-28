<script lang="ts">
	import { onMount } from 'svelte';
	import Resume from '$lib/resume.markdown';
	import Contact from '$lib/Contact.svelte';
	import Print from '$lib/PrintButton.svelte';
	import { breadcrumbs } from '@/stores/breadcrumb';

	onMount(() => {
		breadcrumbs.set([
			{ href: '/', label: 'Home' },
			{ href: '/resume', label: 'Resume' }
		]);

		return () => {
			// Reset to default when component unmounts
			breadcrumbs.set([{ href: '/', label: 'Home' }]);
		};
	});
</script>

<Resume>
	<Contact />
	<div class="mt-4">
		<Print />
	</div>
</Resume>
