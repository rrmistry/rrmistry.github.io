import { expect, test } from '@playwright/test';

test.describe('Breadcrumb Navigation', () => {
	test('breadcrumbs show correct links on blog post page', async ({ page }) => {
		// Navigate to a specific blog post
		await page.goto('/blogs/kubernetes-intro-for-non-developers');
		
		// Wait for breadcrumbs to be visible
		const breadcrumbNav = page.locator('nav[aria-label="breadcrumb"]');
		await expect(breadcrumbNav).toBeVisible();
		
		// Check that all breadcrumb items are present
		const breadcrumbItems = breadcrumbNav.locator('ol > li');
		await expect(breadcrumbItems).toHaveCount(3);
		
		// Check Home breadcrumb
		const homeBreadcrumb = breadcrumbItems.nth(0).locator('a');
		await expect(homeBreadcrumb).toHaveText('Home');
		await expect(homeBreadcrumb).toHaveAttribute('href', '/');
		
		// Check Blogs breadcrumb
		const blogsBreadcrumb = breadcrumbItems.nth(1).locator('a');
		await expect(blogsBreadcrumb).toHaveText('Blogs');
		await expect(blogsBreadcrumb).toHaveAttribute('href', '/blogs');
		
		// Check current page breadcrumb (should not be a link)
		const currentBreadcrumb = breadcrumbItems.nth(2);
		await expect(currentBreadcrumb).toContainText('Kubernetes Intro for Non-Developers');
		// Current page should not have a link
		await expect(currentBreadcrumb.locator('a')).toHaveCount(0);
	});

	test('breadcrumb navigation works correctly', async ({ page }) => {
		// Start at a blog post
		await page.goto('/blogs/kubernetes-intro-for-non-developers');
		
		// Click on Blogs breadcrumb
		await page.click('nav[aria-label="breadcrumb"] a[href="/blogs"]');
		await expect(page).toHaveURL('/blogs');
		
		// Navigate back to home using breadcrumb
		await page.click('nav[aria-label="breadcrumb"] a[href="/"]');
		await expect(page).toHaveURL('/');
	});

	test('breadcrumbs update when navigating between blog posts', async ({ page }) => {
		// Navigate to first blog post
		await page.goto('/blogs/kubernetes-intro-for-non-developers');
		
		// Check the current breadcrumb
		let currentBreadcrumb = page.locator('nav[aria-label="breadcrumb"] ol > li').nth(2);
		await expect(currentBreadcrumb).toContainText('Kubernetes Intro for Non-Developers');
		
		// Navigate to blogs list
		await page.goto('/blogs');
		
		// Click on a different blog post if available
		const blogLinks = page.locator('a[href^="/blogs/"]:not([href="/blogs/"])');
		const blogCount = await blogLinks.count();
		
		if (blogCount > 1) {
			// Click on the second blog post
			await blogLinks.nth(1).click();
			
			// Wait for navigation
			await page.waitForURL(/\/blogs\/[^/]+$/);
			
			// Check that breadcrumb updated
			currentBreadcrumb = page.locator('nav[aria-label="breadcrumb"] ol > li').nth(2);
			const breadcrumbText = await currentBreadcrumb.textContent();
			expect(breadcrumbText).not.toBe('Kubernetes Intro for Non-Developers');
		}
	});

	test('breadcrumbs should not show undefined in href', async ({ page }) => {
		// Navigate to a blog post
		await page.goto('/blogs/kubernetes-intro-for-non-developers');
		
		// Check that no breadcrumb link contains 'undefined'
		const breadcrumbLinks = page.locator('nav[aria-label="breadcrumb"] a');
		const linkCount = await breadcrumbLinks.count();
		
		for (let i = 0; i < linkCount; i++) {
			const href = await breadcrumbLinks.nth(i).getAttribute('href');
			expect(href).not.toContain('undefined');
		}
	});
});

test.describe('Mobile Breadcrumb Navigation', () => {
	test.use({ viewport: { width: 375, height: 667 } });
	
	test('breadcrumbs should be visible on mobile', async ({ page }) => {
		await page.goto('/blogs/kubernetes-intro-for-non-developers');
		
		const breadcrumbNav = page.locator('nav[aria-label="breadcrumb"]');
		await expect(breadcrumbNav).toBeVisible();
		
		// Check that breadcrumbs are not cut off on mobile
		const breadcrumbBox = await breadcrumbNav.boundingBox();
		expect(breadcrumbBox?.width).toBeLessThanOrEqual(375);
	});
});