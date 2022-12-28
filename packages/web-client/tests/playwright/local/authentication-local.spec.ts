import { test, expect } from '@playwright/test';

test('[Local] Check logged in state & visit profile page', async ({ page }) => {
	await page.goto('http://localhost:5173/menu?test=true');

	await page.evaluate(() => {
		return new Promise((resolve) => setTimeout(resolve, 500));
	});

	const viewProfileLink = page.locator('text=View Profile');

	await expect(viewProfileLink).toBeVisible({ timeout: 20_000 });

	await Promise.all([page.waitForNavigation(), await viewProfileLink.click()]);

	console.log('viewProfileLink', viewProfileLink);

	await expect(page.url().includes('profile')).toBeTruthy();
});
