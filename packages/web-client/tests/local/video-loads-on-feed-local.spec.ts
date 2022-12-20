import { test, expect } from '@playwright/test';

test('[Local] Video source is properly loaded on feed', async ({ page }) => {
	await page.goto('http://localhost:5173');

	const videoEls = await page.locator('div .swiper-slide > player > video');
	const videoEl = await videoEls.nth(0);

	console.log(
		'time now 1',
		videoEl.evaluate((e) => (e as HTMLVideoElement).play())
	);

	await page.evaluate(() => {
		return new Promise((resolve) => setTimeout(resolve, 5000));
	});

	await videoEl.click();

	await page.evaluate(() => {
		return new Promise((resolve) => setTimeout(resolve, 5000));
	});

	const t = await videoEl.evaluate((e) => (e as HTMLVideoElement).currentTime);

	expect(t).toBeGreaterThan(0);
});
