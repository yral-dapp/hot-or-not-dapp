import { test, expect } from '@playwright/test';

test('Open login modal from menu after auth client initializes', async ({ page }) => {
	await page.goto('https://vyatz-hqaaa-aaaam-qauea-cai.ic0.app/menu');

	await page.waitForResponse((res) => res.url().includes('https://ic0.app/api/v2/canister'));

	await expect(page.getByText('Join Hot or Not')).toBeHidden();

	const loginBtn = page.locator('text=Login');
	await loginBtn.click();

	await expect(page.getByText('Join Hot or Not')).toBeVisible();
});
