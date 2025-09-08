<script lang="ts">
	import Sun from 'lucide-svelte/icons/sun';
	import Moon from 'lucide-svelte/icons/moon';

	import { toggleMode } from 'mode-watcher';
	import { Button } from '$lib/components/ui/button/index.js';
</script>

<Button onclick={toggleMode} variant="outline" size="icon" 
       class="hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 dark:hover:from-slate-800 dark:hover:to-slate-700 hover:border-gradient-to-r hover:from-amber-300 hover:to-orange-300 dark:hover:from-slate-600 dark:hover:to-slate-500 transition-all duration-200">
	<Sun
		class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-600 dark:text-amber-400"
	/>
	<Moon
		class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-blue-600 dark:text-blue-400"
	/>
	<span class="sr-only">Toggle theme</span>
</Button>
