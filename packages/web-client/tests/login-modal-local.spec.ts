import { test, expect } from '@playwright/test';

test('Menu page loads', async ({ page }) => {
	await page.goto('http://localhost:5173/menu');

	await page.waitForResponse((res) => res.url().includes('http://localhost:8000'));

	await expect(page.getByText('Join Hot or Not')).toBeHidden();

	const loginBtn = page.locator('text=Login');
	await loginBtn.click();

	await expect(page.getByText('Join Hot or Not')).toBeVisible();
});
