import { test, expect } from '@playwright/test';

test('Menu page loads', async ({ page }) => {
	await page.goto('http://localhost:5173/menu');

	// Expect a title "to contain" a substring.
	await expect(page).toHaveTitle(/Hot or Not/);

	await page.evaluate(() => {
		// wait for 5 seconds for AgentJs to initialize
		return new Promise((resolve) => setTimeout(resolve, 5000));
	});

	// create a locator
	const loginBtn = page.locator('text=Login');

	// Click the get started link.
	await loginBtn.click();

	await page.evaluate(() => {
		// wait for modal animation to finish
		return new Promise((resolve) => setTimeout(resolve, 1500));
	});

	// Expects the URL to contain intro.
	await expect(page.getByText('Join Hot or Not')).toBeVisible();
});
