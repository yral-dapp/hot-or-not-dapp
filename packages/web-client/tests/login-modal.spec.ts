import { test, expect } from '@playwright/test';

test('Menu page loads', async ({ page }) => {
	await page.goto('http://localhost:5173/menu');

	// Expect a title "to contain" a substring.
	await expect(page).toHaveTitle(/Hot or Not/);

	await page.waitForResponse((res) => res.url().includes('http://localhost:8000/api/v2/canister'));

	await expect(page.getByText('Join Hot or Not')).toBeHidden();

	const loginBtn = page.locator('text=Login');
	await loginBtn.click();

	await expect(page.getByText('Join Hot or Not')).toBeVisible();
});
