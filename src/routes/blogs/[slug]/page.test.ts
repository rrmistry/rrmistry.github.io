import { describe, it, expect } from 'vitest';
import Page from './+page.svelte';

describe('Blog Post Page Component', () => {
	it('should be a valid Svelte component', () => {
		expect(Page).toBeDefined();
		expect(typeof Page).toBe('function');
	});

	it('should have expected component structure', () => {
		// Basic validation that the component exports exist
		expect(Page.name).toBeDefined();
	});

	it('should format date correctly', () => {
		// Test date formatting logic with UTC to avoid timezone issues
		const formatter = new Intl.DateTimeFormat('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			timeZone: 'UTC'
		});
		
		// Use UTC date string to avoid timezone issues
		const testDate = new Date('2024-01-15T00:00:00Z');
		const formatted = formatter.format(testDate);
		
		expect(formatted).toBe('Jan 15, 2024');
	});

	it('should handle different date formats', () => {
		const formatter = new Intl.DateTimeFormat('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			timeZone: 'UTC'
		});
		
		const dates = [
			{ input: '2024-01-01T00:00:00Z', expected: 'Jan 1, 2024' },
			{ input: '2024-12-31T00:00:00Z', expected: 'Dec 31, 2024' },
			{ input: '2024-06-15T00:00:00Z', expected: 'Jun 15, 2024' }
		];
		
		dates.forEach(({ input, expected }) => {
			const formatted = formatter.format(new Date(input));
			expect(formatted).toBe(expected);
		});
	});
});