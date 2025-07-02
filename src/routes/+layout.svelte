<script lang="ts">
	import { breadcrumbs } from '@/stores/breadcrumb';
	import * as Sidebar from '$lib/components/ui/sidebar/index.ts';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.ts';
	import { Separator } from '$lib/components/ui/separator/index.ts';
	import LightDarkButton from '$lib/components/light-dark-button.svelte';
	import StatusBar from '$lib/components/status-bar.svelte';
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';

	let { children } = $props();
	import Navbar from '$lib/Navbar.svelte';
</script>

<ModeWatcher />

<Sidebar.Provider>
	<AppSidebar />
	<Sidebar.Inset>
		<main>
			<header
				class="no-print fixed top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b"
			>
				<div class="flex items-center gap-2 px-4">
					<Sidebar.Trigger class="-ml-1" />
					<Separator orientation="vertical" class="mr-2 h-4" />
					<Breadcrumb.Root>
						<Breadcrumb.List>
							{#each $breadcrumbs as crumb, i}
								<Breadcrumb.Item class="text-sm md:text-base">
									{#if i === $breadcrumbs.length - 1}
										<Breadcrumb.Page>{crumb.label}</Breadcrumb.Page>
									{:else}
										<Breadcrumb.Link href={crumb.href}>{crumb.label}</Breadcrumb.Link>
									{/if}
								</Breadcrumb.Item>
								{#if i < $breadcrumbs.length - 1}
									<Breadcrumb.Separator class="mx-1 md:mx-2" />
								{/if}
							{/each}
						</Breadcrumb.List>
					</Breadcrumb.Root>
				</div>
			</header>
			<div class="flex flex-1 flex-col gap-4 p-4 pt-20">
				<div class="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
					<article
						class="element-to-print prose m-8 max-w-none justify-self-center dark:prose-invert"
					>
						{@render children()}
					</article>
				</div>
			</div>
		</main>
		<StatusBar />
	</Sidebar.Inset>
</Sidebar.Provider>
