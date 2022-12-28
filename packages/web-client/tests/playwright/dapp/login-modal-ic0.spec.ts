import { test, expect } from '@playwright/test';

test('[DApp] Modal for login works on menu page', async ({ page }) => {
	await page.goto('https://vyatz-hqaaa-aaaam-qauea-cai.raw.ic0.app/menu');

	const loginBtn = page.locator('text=Login');

	await expect(loginBtn).toBeVisible({ timeout: 20_000 });

	await expect(page.getByText('Join Hot or Not')).toBeHidden();

	await loginBtn.click();

	await expect(page.getByText('Join Hot or Not')).toBeVisible();
});
