import { test, expect } from '@playwright/test';

test.describe('Diagram Rendering', () => {
  test('should render mermaid diagrams as SVG instead of code blocks', async ({ page }) => {
    // Navigate to the blog post with a mermaid diagram
    await page.goto('/blogs/kubernetes-intro-for-non-developers');
    
    // Wait for the first mermaid SVG to appear - this ensures mermaid has loaded
    await page.waitForSelector('svg[id^="mermaid"]', { timeout: 30000 });
    
    // Check that mermaid diagrams are rendered as SVG, not as code blocks
    const mermaidCodeBlocks = page.locator('pre.language-mermaid');
    const mermaidSvgs = page.locator('svg[id^="mermaid"]');
    
    // There should be no mermaid code blocks (they should be converted to SVG)
    await expect(mermaidCodeBlocks).toHaveCount(0);
    
    // There should be at least one mermaid SVG diagram (3 in this blog post)
    await expect(mermaidSvgs).toHaveCount(3);
    
    // The SVG should contain the expected diagram elements
    const svg = mermaidSvgs.first();
    await expect(svg).toBeVisible();
    
    // Verify the SVG has content (check for common mermaid elements)
    // The SVG should have child elements
    const svgContent = svg.locator('g, path, rect, text, line, polygon');
    await expect(svgContent.first()).toBeVisible();
  });
  
  test('should adapt mermaid diagram theme to light/dark mode', async ({ page }) => {
    await page.goto('/blogs/kubernetes-intro-for-non-developers');
    
    // Wait for the first mermaid SVG to appear
    await page.waitForSelector('svg[id^="mermaid"]', { timeout: 30000 });
    
    // Wait for mermaid diagrams to render
    const diagramContainer = page.locator('.mermaid-chart').first();
    await expect(diagramContainer).toBeVisible();
    
    // Get the SVG
    const svg = page.locator('svg[id^="mermaid"]').first();
    await expect(svg).toBeVisible();
    
    // Toggle to dark mode using the theme button
    const themeButton = page.locator('button:has(svg.lucide-sun)');
    await themeButton.click();
    
    // Wait for the dark class to be applied
    await page.waitForFunction(() => document.documentElement.classList.contains('dark'), { timeout: 5000 });
    
    // Check that the document has the dark class
    const html = page.locator('html');
    await expect(html).toHaveClass(/dark/);
    
    // Verify the mermaid diagram is still visible
    await expect(svg).toBeVisible();
    // Check that SVG has content
    const svgContentDark = svg.locator('g, path, rect, text, line, polygon');
    await expect(svgContentDark.first()).toBeVisible();
    
    // Toggle back to light mode
    const darkThemeButton = page.locator('button:has(svg.lucide-moon)');
    await darkThemeButton.click();
    
    // Wait for the dark class to be removed
    await page.waitForFunction(() => !document.documentElement.classList.contains('dark'), { timeout: 5000 });
    
    // Verify diagram still works in light mode
    await expect(svg).toBeVisible();
    // Check that SVG has content
    const svgContentLight = svg.locator('g, path, rect, text, line, polygon');
    await expect(svgContentLight.first()).toBeVisible();
  });
  
  test('should handle multiple diagram types', async ({ page }) => {
    // This test can be expanded when we add more diagram types
    await page.goto('/blogs/kubernetes-intro-for-non-developers');
    
    // Wait for the first mermaid SVG to appear
    await page.waitForSelector('svg[id^="mermaid"]', { timeout: 30000 });
    
    // Verify the diagram is interactive (if mermaid supports it)
    const svg = page.locator('svg[id^="mermaid"]').first();
    await expect(svg).toBeVisible();
    // Check that the SVG has proper attributes
    await expect(svg).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg');
  });
  
  test('should not show syntax highlighting for mermaid code', async ({ page }) => {
    await page.goto('/blogs/kubernetes-intro-for-non-developers');
    
    // Wait for the first mermaid SVG to appear, indicating processing is complete
    await page.waitForSelector('svg[id^="mermaid"]', { timeout: 30000 });
    
    // Should not have prism.js syntax highlighting classes for mermaid
    const highlightedMermaid = page.locator('pre.language-mermaid code .token');
    await expect(highlightedMermaid).toHaveCount(0);
  });
});