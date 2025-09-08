<script lang="ts">
	import { onMount } from 'svelte';
	import Contact from '$lib/Contact.svelte';
	import Print from '$lib/PrintButton.svelte';
	import { breadcrumbs } from '@/stores/breadcrumb';

	onMount(() => {
		breadcrumbs.set([
			{ href: '/', label: 'Home' },
			{ href: '/contact', label: 'Contact' }
		]);

		return () => {
			// Reset to default when component unmounts
			breadcrumbs.set([{ href: '/', label: 'Home' }]);
		};
	});
</script>

<div class="w-full overflow-hidden lg:mx-auto lg:max-w-5xl lg:px-8">
	<iframe
		src="https://outlook.office.com/book/RighteousAIInc@righteous.ai/?ismsaljsauthenabled"
		width="100%"
		height="1000em"
		scrolling="yes"
		style="border:0; width: 100vw; max-width: 100%; transform-origin: top left;"
		class="min-h-screen rounded-none sm:rounded-lg lg:w-full"
		title="Book a Meeting"
	></iframe>
</div>

<div class="my-8 flex w-full flex-col items-center gap-4">
	<Contact />
</div>
