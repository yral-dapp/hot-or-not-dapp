import { test, expect } from '@playwright/test';

test('Menu page loads', async ({ page }) => {
	await page.goto('https://hotornot.wtf/menu');

	// Expect a title "to contain" a substring.
	await expect(page).toHaveTitle(/Hot or Not/);

	await page.evaluate(() => {
		// wait for 5 seconds for AgentJs to initialize
		return new Promise((resolve) => setTimeout(resolve, 5000));
	});

	await expect(page.getByText('Join Hot or Not')).toBeHidden();

	const loginBtn = page.locator('text=Login');
	await loginBtn.click();

	await expect(page.getByText('Join Hot or Not')).toBeVisible();
});
