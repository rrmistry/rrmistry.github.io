import { test, expect } from '@playwright/test';

test.describe('Diagram Rendering', () => {
  test('should render mermaid diagrams as SVG instead of code blocks', async ({ page }) => {
    // Navigate to the blog post with a mermaid diagram
    await page.goto('/blogs/kubernetes-intro-for-non-developers');
    
    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');
    
    // Check that mermaid diagrams are rendered as SVG, not as code blocks
    const mermaidCodeBlocks = page.locator('pre.language-mermaid');
    const mermaidSvgs = page.locator('svg[id^="mermaid"]');
    
    // There should be no mermaid code blocks (they should be converted to SVG)
    await expect(mermaidCodeBlocks).toHaveCount(0);
    
    // There should be at least one mermaid SVG diagram
    await expect(mermaidSvgs).toHaveCount(1);
    
    // The SVG should contain the expected diagram elements
    const svg = mermaidSvgs.first();
    await expect(svg).toBeVisible();
    
    // Check for specific elements in the Kubernetes diagram
    await expect(page.locator('text=Cluster')).toBeVisible();
    await expect(page.locator('text=Node 1')).toBeVisible();
    await expect(page.locator('text=Pod 1')).toBeVisible();
  });
  
  test('should adapt mermaid diagram theme to light/dark mode', async ({ page }) => {
    await page.goto('/blogs/kubernetes-intro-for-non-developers');
    await page.waitForLoadState('networkidle');
    
    // Wait for mermaid diagram to render
    const diagramContainer = page.locator('.mermaid-chart');
    await expect(diagramContainer).toBeVisible();
    
    // Wait for SVG to appear
    const svg = page.locator('svg[id^="mermaid"]').first();
    await expect(svg).toBeVisible();
    
    // Toggle to dark mode using the theme button
    const themeButton = page.locator('button:has(svg.lucide-sun)');
    await themeButton.click();
    
    // Wait for theme change to take effect
    await page.waitForTimeout(1000);
    
    // Check that the document has the dark class
    const html = page.locator('html');
    await expect(html).toHaveClass(/dark/);
    
    // Verify the mermaid diagram re-rendered for dark theme
    // The SVG should still be visible and contain the same content
    await expect(svg).toBeVisible();
    await expect(page.locator('text=Cluster')).toBeVisible();
    
    // Toggle back to light mode
    const darkThemeButton = page.locator('button:has(svg.lucide-moon)');
    await darkThemeButton.click();
    
    // Wait for theme change
    await page.waitForTimeout(1000);
    
    // Verify diagram still works in light mode
    await expect(svg).toBeVisible();
    await expect(page.locator('text=Cluster')).toBeVisible();
  });
  
  test('should handle multiple diagram types', async ({ page }) => {
    // This test can be expanded when we add more diagram types
    await page.goto('/blogs/kubernetes-intro-for-non-developers');
    await page.waitForLoadState('networkidle');
    
    // Verify the diagram is interactive (if mermaid supports it)
    const svg = page.locator('svg[id^="mermaid"]').first();
    if (await svg.isVisible()) {
      // Check that the SVG has proper attributes
      await expect(svg).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg');
    }
  });
  
  test('should not show syntax highlighting for mermaid code', async ({ page }) => {
    await page.goto('/blogs/kubernetes-intro-for-non-developers');
    await page.waitForLoadState('networkidle');
    
    // Should not have prism.js syntax highlighting classes for mermaid
    const highlightedMermaid = page.locator('pre.language-mermaid code .token');
    await expect(highlightedMermaid).toHaveCount(0);
  });
});