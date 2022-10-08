import { test, expect } from '@playwright/test';

test('Menu page loads', async ({ page }) => {
	await page.goto('http://localhost:5173');

	// Expect a title "to contain" a substring.
	await expect(page).toHaveTitle(/Hot or Not/);

	// create a locator
	const loginBtn = page.locator('text=Login');

	// Click the get started link.
	await loginBtn.click();

	// Expects the URL to contain intro.
	await expect(page).toContain('Join Hot or Not');
});
