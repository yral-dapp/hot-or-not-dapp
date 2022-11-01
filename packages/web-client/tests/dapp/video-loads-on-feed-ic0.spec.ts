import { test, expect } from '@playwright/test';

test('[DApp] Video source is properly loaded on feed', async ({ page }) => {
	await page.goto('https://vyatz-hqaaa-aaaam-qauea-cai.raw.ic0.app');

	await page.waitForLoadState('networkidle');

	const videoEls = await page.locator('div .swiper-slide > player > video');
	const videoSrc = await videoEls.nth(0).getAttribute('src');

	expect(videoSrc?.includes('default.mp4'));
});
