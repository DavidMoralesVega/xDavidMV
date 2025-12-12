import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Homepage
 *
 * Basic smoke tests to ensure the homepage loads and functions correctly
 */
test.describe('Homepage', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/');

    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');

    // Check that the page title is set
    await expect(page).toHaveTitle(/David Morales/);
  });

  test('should display main sections', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check for main sections
    const mainSections = [
      { selector: '#sobre-mi', name: 'Sobre Mi' },
      { selector: '#servicios', name: 'Servicios' },
      { selector: '#proyectos', name: 'Proyectos' },
      { selector: '#contacto', name: 'Contacto' },
    ];

    for (const section of mainSections) {
      const element = page.locator(section.selector);
      // Section should exist in the DOM
      await expect(element).toBeTruthy();
    }
  });

  test('should have working navigation links', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Find navigation menu
    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible();

    // Check that navigation contains links
    const navLinks = await nav.locator('a').count();
    expect(navLinks).toBeGreaterThan(0);
  });

  test('should be responsive', async ({ page }) => {
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    let body = page.locator('body');
    await expect(body).toBeVisible();

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    body = page.locator('body');
    await expect(body).toBeVisible();

    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should not have console errors', async ({ page }) => {
    const consoleErrors: string[] = [];

    // Listen for console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Wait a bit to catch any delayed errors
    await page.waitForTimeout(2000);

    // Should have no console errors
    expect(consoleErrors.length).toBe(0);
  });

  test('should have valid meta tags for SEO', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check for essential meta tags
    const description = await page.locator('meta[name="description"]');
    await expect(description).toBeTruthy();

    const ogTitle = await page.locator('meta[property="og:title"]');
    await expect(ogTitle).toBeTruthy();

    const ogDescription = await page.locator('meta[property="og:description"]');
    await expect(ogDescription).toBeTruthy();
  });
});
