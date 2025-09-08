<script lang="ts" module>
	import TopLeftIcon from 'lucide-svelte/icons/at-sign';
	import House from 'lucide-svelte/icons/house';
	import ResumeIcon from 'lucide-svelte/icons/file-user';
	import ContactIcon from 'lucide-svelte/icons/contact-round';
	import BlogIcon from 'lucide-svelte/icons/rss';
	// sample data
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
	import SearchForm from '$lib/components/search-form.svelte';
	import VersionSwitcher from '$lib/components/version-switcher.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import LightDarkButton from '$lib/components/light-dark-button.svelte';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import type { ComponentProps } from 'svelte';
	import Contact from '$lib/Contact.svelte';
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
						class="aspect-square flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
					>
						<TopLeftIcon class="size-4" />
					</div>
					<div class="ml-2 mr-2 content-center font-semibold">Rohit Mistry</div>
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
										<a href={item.url} data-sveltekit-reload {...props}>
											{#if item.icon}
												<item.icon />
											{/if}
											<span>{item.title}</span>
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
								<a href="/blogs" data-sveltekit-reload {...props}>
									<BlogIcon />
									<span>Blogs</span>
								</a>
							{/snippet}
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
					<BlogList limit={5} hideSearch={true}>
						{#snippet row(post: Blog)}
							<Sidebar.MenuItem>
								<Sidebar.MenuButton class="h-auto px-2 py-2">
									{#snippet child({ props })}
										<a
											href="/blogs/{post.slug}"
											data-sveltekit-reload
											{...props}
											class="block w-full"
										>
											<div class="flex flex-col items-start space-y-1 text-left">
												<span class="line-clamp-2 text-sm font-medium leading-tight">
													{post.title}
												</span>
												<time class="text-xs text-muted-foreground" datetime={post.date}>
													{new Intl.DateTimeFormat('en-US', {
														month: 'short',
														day: 'numeric',
														year: 'numeric'
													}).format(new Date(post.date))}
												</time>
											</div>
										</a>
									{/snippet}
								</Sidebar.MenuButton>
							</Sidebar.MenuItem>
						{/snippet}
					</BlogList>
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>
	<Sidebar.Rail />
</Sidebar.Root>
