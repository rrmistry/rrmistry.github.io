// stores/breadcrumb.ts
import { writable } from 'svelte/store';

export const breadcrumbs = writable([{ href: '/', label: 'Home' }]);
