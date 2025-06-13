import { describe, it, expect } from 'vitest';
import TagBadge from './TagBadge.svelte';

describe('TagBadge Component - Basic Tests', () => {
	it('should be a valid Svelte component', () => {
		expect(TagBadge).toBeDefined();
		expect(typeof TagBadge).toBe('function');
	});

	it('should have expected component structure', () => {
		// Check that the component exports exist
		expect(TagBadge.name).toBeDefined();
	});
});