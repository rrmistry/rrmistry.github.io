<script lang="ts" module>
	import TopLeftIcon from 'lucide-svelte/icons/at-sign';
	import House from 'lucide-svelte/icons/house';
	import ResumeIcon from 'lucide-svelte/icons/file-user';
	import ContactIcon from 'lucide-svelte/icons/contact-round';
	import BlogIcon from 'lucide-svelte/icons/rss';
	// app sidebar links data
	const data = {
		versions: ['1.0.1', '1.1.0-alpha', '2.0.0-beta1'],
		navMain: [
			{
				title: 'About Me',
				url: '/',
				items: [
					{
						title: 'Home',
						url: '/',
						icon: House
					},
					{
						title: 'CV',
						url: '/resume',
						icon: ResumeIcon
					},
					{
						title: 'Contact',
						url: '/contact',
						icon: ContactIcon
					}
				]
			}
		]
	};
</script>

<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import LightDarkButton from '$lib/components/light-dark-button.svelte';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import type { ComponentProps } from 'svelte';
	import BlogList from '$lib/BlogList.svelte';
	import type { Blog } from '$lib/blog';

	let { ref = $bindable(null), ...restProps }: ComponentProps<typeof Sidebar.Root> = $props();
</script>

<Sidebar.Root {...restProps} bind:ref>
	<Sidebar.Header>
		<Sidebar.Menu>
			<Sidebar.MenuItem
				class="flex justify-between data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
			>
				<div class="flex items-center">
					<div
						class="aspect-square flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg"
					>
						<TopLeftIcon class="size-4" />
					</div>
					<div class="ml-2 mr-2 content-center font-semibold">
						<span class="bg-gradient-to-r from-blue-700 to-purple-700 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
							Rohit Mistry
						</span>
					</div>
				</div>
				<div class="flex items-center">
					<Separator orientation="vertical" class="mr-2 h-4" />
					<LightDarkButton />
				</div>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Header>
	<Sidebar.Content>
		<!-- We create a Sidebar.Group for each parent. -->
		{#each data.navMain as group (group.title)}
			<Sidebar.Group>
				<Sidebar.GroupLabel>{group.title}</Sidebar.GroupLabel>
				<Sidebar.GroupContent>
					<Sidebar.Menu>
						{#each group.items as item (item.title)}
							<Sidebar.MenuItem>
								<Sidebar.MenuButton>
									{#snippet child({ props })}
										<a
											href={item.url}
											data-sveltekit-reload
											{...props}
											class="group flex items-center gap-3 rounded-md px-3 py-2 relative overflow-hidden transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-500/10 hover:via-purple-500/8 hover:to-indigo-500/10 hover:shadow-md hover:shadow-blue-500/10 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-blue-400/10 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-500 before:ease-out"
										>
											{#if item.icon}
												<item.icon
													class="h-4 w-4 transition-colors duration-200 group-hover:text-blue-600"
												/>
											{/if}
											<span class="transition-colors duration-200 group-hover:text-blue-700"
												>{item.title}</span
											>
										</a>
									{/snippet}
								</Sidebar.MenuButton>
							</Sidebar.MenuItem>
						{/each}
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			</Sidebar.Group>
		{/each}
		<Separator class="my-2" />
		<Sidebar.Group>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					<Sidebar.MenuItem>
						<Sidebar.MenuButton>
							{#snippet child({ props })}
								<a
									href="/blogs"
									data-sveltekit-reload
									{...props}
									class="group flex items-center gap-3 rounded-md px-3 py-2 relative overflow-hidden transition-all duration-300 hover:bg-gradient-to-r hover:from-green-500/10 hover:via-blue-500/8 hover:to-teal-500/10 hover:shadow-md hover:shadow-green-500/10 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-green-400/10 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-500 before:ease-out"
								>
									<BlogIcon class="h-4 w-4 transition-colors duration-200 group-hover:text-green-600" />
									<span class="transition-colors duration-200 group-hover:text-green-700"
										>Blogs</span
									>
								</a>
							{/snippet}
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
					<div class="mt-2">
						<BlogList limit={5} hideSearch={true} variant="sidebar">
							{#snippet row(_post: Blog)}
								<!-- This snippet won't be used for sidebar variant -->
							{/snippet}
						</BlogList>
					</div>
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>
	<Sidebar.Rail />
</Sidebar.Root>
