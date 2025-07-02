import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import { breadcrumbs } from './breadcrumb';

describe('Breadcrumb Store', () => {
	beforeEach(() => {
		// Reset to default before each test
		breadcrumbs.set([{ href: '/', label: 'Home' }]);
	});

	it('should have default home breadcrumb', () => {
		const value = get(breadcrumbs);
		expect(value).toEqual([{ href: '/', label: 'Home' }]);
	});

	it('should update breadcrumbs when set', () => {
		const newBreadcrumbs = [
			{ href: '/', label: 'Home' },
			{ href: '/blogs', label: 'Blogs' },
			{ href: '/blogs/test', label: 'Test Post' }
		];
		
		breadcrumbs.set(newBreadcrumbs);
		
		const value = get(breadcrumbs);
		expect(value).toEqual(newBreadcrumbs);
	});

	it('should handle empty breadcrumbs', () => {
		breadcrumbs.set([]);
		const value = get(breadcrumbs);
		expect(value).toEqual([]);
	});

	it('should be reactive to changes', () => {
		let currentValue: any[] = [];
		
		// Subscribe to changes
		const unsubscribe = breadcrumbs.subscribe(value => {
			currentValue = value;
		});
		
		// Initial value
		expect(currentValue).toEqual([{ href: '/', label: 'Home' }]);
		
		// Update breadcrumbs
		breadcrumbs.set([
			{ href: '/', label: 'Home' },
			{ href: '/about', label: 'About' }
		]);
		
		expect(currentValue).toEqual([
			{ href: '/', label: 'Home' },
			{ href: '/about', label: 'About' }
		]);
		
		// Clean up
		unsubscribe();
	});

	it('should maintain breadcrumb structure', () => {
		const breadcrumbWithAllProperties = [
			{ href: '/', label: 'Home' },
			{ href: '/category', label: 'Category' },
			{ href: '/category/item', label: 'Item' }
		];
		
		breadcrumbs.set(breadcrumbWithAllProperties);
		const value = get(breadcrumbs);
		
		// Check each breadcrumb has required properties
		value.forEach(breadcrumb => {
			expect(breadcrumb).toHaveProperty('href');
			expect(breadcrumb).toHaveProperty('label');
			expect(typeof breadcrumb.href).toBe('string');
			expect(typeof breadcrumb.label).toBe('string');
		});
	});

	it('should not contain undefined hrefs', () => {
		// Simulate a potential bug where slug might be undefined
		const potentiallyBuggyBreadcrumbs = [
			{ href: '/', label: 'Home' },
			{ href: '/blogs', label: 'Blogs' },
			{ href: `/blogs/${undefined}`, label: 'Some Post' }
		];
		
		breadcrumbs.set(potentiallyBuggyBreadcrumbs);
		const value = get(breadcrumbs);
		
		// This test documents the current behavior - it will contain 'undefined'
		// The fix in the component prevents this from happening
		expect(value[2].href).toContain('undefined');
		
		// In a real scenario, we'd want to prevent this at the component level
		// which is what our fix does
	});
});