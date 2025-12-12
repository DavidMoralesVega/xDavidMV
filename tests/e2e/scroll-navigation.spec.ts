import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Scroll Navigation
 *
 * The user reported that scroll navigation "fails sometimes" - these tests
 * help identify and reproduce the issues.
 */
test.describe('Scroll Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage before each test
    await page.goto('/');
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  test('should navigate to sections via hash links', async ({ page }) => {
    // Test navigation to different sections
    const sections = ['#sobre-mi', '#servicios', '#proyectos', '#contacto'];

    for (const section of sections) {
      // Click on navigation link
      const navLink = page.locator(`a[href="${section}"]`).first();

      if (await navLink.isVisible()) {
        await navLink.click();

        // Wait for scroll animation to complete
        await page.waitForTimeout(1000);

        // Verify the URL hash changed
        expect(page.url()).toContain(section);

        // Verify the target section is in viewport
        const targetSection = page.locator(section);
        await expect(targetSection).toBeInViewport();
      }
    }
  });

  test('should scroll smoothly without jumping', async ({ page }) => {
    // Get initial scroll position
    const initialScroll = await page.evaluate(() => window.scrollY);

    // Click on a section link
    const contactLink = page.locator('a[href="#contacto"]').first();
    if (await contactLink.isVisible()) {
      await contactLink.click();

      // Wait a bit for scroll to start
      await page.waitForTimeout(100);

      // Check that scroll is progressing smoothly
      const midScroll = await page.evaluate(() => window.scrollY);
      expect(midScroll).toBeGreaterThan(initialScroll);

      // Wait for scroll to complete
      await page.waitForTimeout(1000);

      // Verify we reached the target
      const finalScroll = await page.evaluate(() => window.scrollY);
      expect(finalScroll).toBeGreaterThan(midScroll);
    }
  });

  test('should maintain scroll position after navigation', async ({ page }) => {
    // Scroll to a specific section
    const servicesLink = page.locator('a[href="#servicios"]').first();
    if (await servicesLink.isVisible()) {
      await servicesLink.click();
      await page.waitForTimeout(1000);

      const scrollAfterNav = await page.evaluate(() => window.scrollY);

      // Wait a bit to ensure position is stable
      await page.waitForTimeout(500);

      const scrollAfterWait = await page.evaluate(() => window.scrollY);

      // Scroll position should be stable (within 50px tolerance)
      expect(Math.abs(scrollAfterNav - scrollAfterWait)).toBeLessThan(50);
    }
  });

  test('should handle rapid consecutive scroll clicks', async ({ page }) => {
    // Test rapid clicking between sections (stress test)
    const links = ['#sobre-mi', '#servicios', '#proyectos'];

    for (let i = 0; i < 3; i++) {
      for (const link of links) {
        const navLink = page.locator(`a[href="${link}"]`).first();
        if (await navLink.isVisible()) {
          await navLink.click();
          // Short delay between clicks to simulate rapid navigation
          await page.waitForTimeout(200);
        }
      }
    }

    // After rapid clicking, page should still be functional
    const finalLink = page.locator('a[href="#contacto"]').first();
    if (await finalLink.isVisible()) {
      await finalLink.click();
      await page.waitForTimeout(1000);

      // Should successfully navigate to contact section
      expect(page.url()).toContain('#contacto');
      const contactSection = page.locator('#contacto');
      await expect(contactSection).toBeInViewport();
    }
  });

  test('should work with browser back/forward buttons', async ({ page }) => {
    // Navigate to a section
    const projectsLink = page.locator('a[href="#proyectos"]').first();
    if (await projectsLink.isVisible()) {
      await projectsLink.click();
      await page.waitForTimeout(1000);

      expect(page.url()).toContain('#proyectos');

      // Go back
      await page.goBack();
      await page.waitForTimeout(1000);

      // Should scroll back to top
      const scrollAfterBack = await page.evaluate(() => window.scrollY);
      expect(scrollAfterBack).toBeLessThan(100);

      // Go forward
      await page.goForward();
      await page.waitForTimeout(1000);

      // Should scroll back to projects
      expect(page.url()).toContain('#proyectos');
      const projectsSection = page.locator('#proyectos');
      await expect(projectsSection).toBeInViewport();
    }
  });

  test('should scroll to section on direct URL access', async ({ page }) => {
    // Navigate directly to a section via URL
    await page.goto('/#servicios');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    // Should automatically scroll to the services section
    const servicesSection = page.locator('#servicios');
    await expect(servicesSection).toBeInViewport();
  });

  test('should handle scroll on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Navigate to homepage
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Test scroll navigation on mobile
    const contactLink = page.locator('a[href="#contacto"]').first();
    if (await contactLink.isVisible()) {
      await contactLink.click();
      await page.waitForTimeout(1000);

      // Should navigate to contact section
      expect(page.url()).toContain('#contacto');
      const contactSection = page.locator('#contacto');
      await expect(contactSection).toBeInViewport();
    }
  });

  test('should not cause layout shift during scroll', async ({ page }) => {
    // Get initial page height
    const initialHeight = await page.evaluate(() => document.body.scrollHeight);

    // Navigate to multiple sections
    const links = ['#sobre-mi', '#servicios', '#proyectos'];

    for (const link of links) {
      const navLink = page.locator(`a[href="${link}"]`).first();
      if (await navLink.isVisible()) {
        await navLink.click();
        await page.waitForTimeout(1000);
      }
    }

    // Page height should remain stable (within 10% tolerance)
    const finalHeight = await page.evaluate(() => document.body.scrollHeight);
    const heightDiff = Math.abs(finalHeight - initialHeight);
    const tolerance = initialHeight * 0.1;

    expect(heightDiff).toBeLessThan(tolerance);
  });
});
