import { test, expect } from '@playwright/test';
import v8toIstanbul from 'v8-to-istanbul';

test('Menu page loads', async ({ page }) => {
	await page.goto('http://localhost:4173/menu');

	await page.coverage.startJSCoverage();

	// Expect a title "to contain" a substring.
	await expect(page).toHaveTitle(/Hot or Not/);

	await page.waitForResponse((res) => res.url().includes('https://ic0.app/api/v2/canister'));

	await expect(page.getByText('Join Hot or Not')).toBeHidden();

	const loginBtn = page.locator('text=Login');
	await loginBtn.click();

	await expect(page.getByText('Join Hot or Not')).toBeVisible();

	const coverage = await page.coverage.stopJSCoverage();

	for (const entry of coverage) {
		const converter = v8toIstanbul('', 0, { source: entry.source ?? '' });
		await converter.load();
		converter.applyCoverage(entry.functions);
		console.table(converter.toIstanbul());
		console.log(JSON.stringify(converter.toIstanbul()));
	}
});
