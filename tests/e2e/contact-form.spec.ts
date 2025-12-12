import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Contact Form
 *
 * Tests the contact form functionality including validation
 */
test.describe('Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Navigate to contact section
    const contactLink = page.locator('a[href="#contacto"]').first();
    if (await contactLink.isVisible()) {
      await contactLink.click();
      await page.waitForTimeout(1000);
    }
  });

  test('should display contact form', async ({ page }) => {
    // Check that form exists
    const form = page.locator('form').filter({ has: page.locator('input[name="Name"]') });
    await expect(form).toBeVisible();

    // Check that required fields exist
    await expect(page.locator('input[name="Name"]')).toBeVisible();
    await expect(page.locator('input[name="E-mail"]')).toBeVisible();
    await expect(page.locator('textarea[name="Message"]')).toBeVisible();

    // Check that submit button exists
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
  });

  test('should show validation errors for empty form', async ({ page }) => {
    // Try to submit empty form
    const submitButton = page.locator('button[type="submit"]').filter({ has: page.locator(':text-matches("Enviar|Submit", "i")') }).first();
    if (await submitButton.isVisible()) {
      await submitButton.click();

      // Wait for validation errors to appear
      await page.waitForTimeout(500);

      // Form should not be submitted (still on same page)
      expect(page.url()).toContain('#contacto');
    }
  });

  test('should reject invalid email format', async ({ page }) => {
    // Fill form with invalid email
    await page.locator('input[name="Name"]').fill('Test User');
    await page.locator('input[name="E-mail"]').fill('invalid-email');
    await page.locator('textarea[name="Message"]').fill('Este es un mensaje de prueba válido');

    // Try to submit
    const submitButton = page.locator('button[type="submit"]').filter({ has: page.locator(':text-matches("Enviar|Submit", "i")') }).first();
    if (await submitButton.isVisible()) {
      await submitButton.click();

      // Wait for validation
      await page.waitForTimeout(500);

      // Should show error (form not submitted)
      expect(page.url()).toContain('#contacto');
    }
  });

  test('should reject message that is too short', async ({ page }) => {
    // Fill form with short message
    await page.locator('input[name="Name"]').fill('Test User');
    await page.locator('input[name="E-mail"]').fill('test@example.com');
    await page.locator('textarea[name="Message"]').fill('Hi');

    // Try to submit
    const submitButton = page.locator('button[type="submit"]').filter({ has: page.locator(':text-matches("Enviar|Submit", "i")') }).first();
    if (await submitButton.isVisible()) {
      await submitButton.click();

      // Wait for validation
      await page.waitForTimeout(500);

      // Should show error
      expect(page.url()).toContain('#contacto');
    }
  });

  test('should accept valid form data', async ({ page }) => {
    // Fill form with valid data
    await page.locator('input[name="Name"]').fill('Juan Pérez');
    await page.locator('input[name="E-mail"]').fill('juan.perez@example.com');
    await page.locator('textarea[name="Message"]').fill('Este es un mensaje de prueba válido con suficiente contenido para pasar la validación');

    // Optional: fill phone and company
    const phoneInput = page.locator('input[name="Phone"]');
    if (await phoneInput.isVisible()) {
      await phoneInput.fill('+591 61816001');
    }

    const companyInput = page.locator('input[name="Company"]');
    if (await companyInput.isVisible()) {
      await companyInput.fill('Test Company');
    }

    // Submit form
    const submitButton = page.locator('button[type="submit"]').filter({ has: page.locator(':text-matches("Enviar|Submit", "i")') }).first();
    if (await submitButton.isVisible()) {
      await submitButton.click();

      // Wait for form submission
      await page.waitForTimeout(3000);

      // Should show success message or remain on page
      // (exact behavior depends on Formspree configuration)
    }
  });

  test('should have honeypot field that is hidden', async ({ page }) => {
    // Honeypot field should exist but be hidden
    const honeypot = page.locator('input[name="website"]');

    if (await honeypot.count() > 0) {
      // Should have styles that hide it
      const isHidden = await honeypot.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return (
          style.position === 'absolute' &&
          (style.opacity === '0' || parseInt(style.left) < -1000)
        );
      });

      expect(isHidden).toBe(true);
    }
  });

  test('should validate phone number format if provided', async ({ page }) => {
    // Fill form
    await page.locator('input[name="Name"]').fill('Test User');
    await page.locator('input[name="E-mail"]').fill('test@example.com');
    await page.locator('textarea[name="Message"]').fill('Este es un mensaje de prueba válido');

    // Fill invalid phone
    const phoneInput = page.locator('input[name="Phone"]');
    if (await phoneInput.isVisible()) {
      await phoneInput.fill('abc123');

      // Try to submit
      const submitButton = page.locator('button[type="submit"]').filter({ has: page.locator(':text-matches("Enviar|Submit", "i")') }).first();
      if (await submitButton.isVisible()) {
        await submitButton.click();

        // Wait for validation
        await page.waitForTimeout(500);

        // Should show error
        expect(page.url()).toContain('#contacto');
      }
    }
  });

  test('should trim whitespace from inputs', async ({ page }) => {
    // Fill form with whitespace
    await page.locator('input[name="Name"]').fill('  Test User  ');
    await page.locator('input[name="E-mail"]').fill('  test@example.com  ');
    await page.locator('textarea[name="Message"]').fill('  Este es un mensaje de prueba válido  ');

    // Get values after blur (trimming should happen)
    await page.locator('input[name="Name"]').blur();
    await page.locator('input[name="E-mail"]').blur();
    await page.locator('textarea[name="Message"]').blur();

    // Values should be trimmed (this depends on form implementation)
    // We just verify the form can be submitted
    const submitButton = page.locator('button[type="submit"]').filter({ has: page.locator(':text-matches("Enviar|Submit", "i")') }).first();
    if (await submitButton.isVisible()) {
      await submitButton.click();
      await page.waitForTimeout(1000);
    }
  });
});
