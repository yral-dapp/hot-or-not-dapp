import { test, expect } from '@playwright/test';

test('Menu page loads', async ({ page }) => {
	await page.goto('http://localhost:4173/feed');

	await page.evaluate(() => {
		// if this doesn't work, you can try to increase 0 to a higher number (i.e. 100)
		return new Promise((resolve) => setTimeout(resolve, 5000));
	});

	const videoEls = await page.locator('video').count();

	await expect(videoEls.valueOf() > 0);

	console.log(videoEls);

	const videoSrc = page.locator('video');
	console.log(videoSrc);

	await expect(videoSrc).toContain('default.mp4');
});
