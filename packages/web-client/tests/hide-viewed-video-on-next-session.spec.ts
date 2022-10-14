import { test, expect } from '@playwright/test';

test('Video once watched should get cached', async ({ page }) => {
	await page.goto('http://localhost:4173');

	await page.waitForLoadState('networkidle');

	const videoEls = await page.locator('div .swiper-wrapper > div .swiper-slide');
	const firstVideoEl = videoEls.nth(1).locator('player > video');
	const firstVideoElSrc = await firstVideoEl.nth(0).getAttribute('src');
	console.log('firstVideoElSrc', firstVideoElSrc);

	await page.evaluate(() => {
		const el = document.getElementsByClassName('swiper-wrapper')[0];
		console.log(el);
		el.scrollTo(0, 700);
	});

	await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 2000)));

	await page.evaluate(() => {
		const el = document.getElementsByClassName('swiper-wrapper')[0];
		console.log(el);
		el.scrollTo(0, 700);
	});

	await page.goto('http://localhost:4173');

	const videoEls2 = await page.locator('div .swiper-wrapper > div .swiper-slide');
	const secondVideoEl = videoEls2.nth(1).locator('player > video');
	const secondVideoElSrc = await secondVideoEl.nth(0).getAttribute('src');
	console.log('firstVideoElSrc', secondVideoElSrc);
});
