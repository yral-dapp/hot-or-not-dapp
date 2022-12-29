import { chromium, expect, type Browser, type Page } from '@playwright/test';
import type { PreviewServer } from 'vite';
import { preview } from 'vite';

import { afterAll, beforeAll, describe, test } from 'vitest';

describe('playwright tests', async () => {
	let server: PreviewServer;
	let browser: Browser;
	let page: Page;

	beforeAll(async () => {
		server = await preview({ preview: { port: 4173 } });
		browser = await chromium.launch();
		page = await browser.newPage();
	});

	afterAll(async () => {
		await browser.close();
		await new Promise<void>((resolve, reject) => {
			server.httpServer.close((error) => (error ? reject(error) : resolve()));
		});
	});

	test('[Web2] Video source is properly loaded on feed', async () => {
		await page.goto('http://0.0.0.0:4173');

		const videoEls = await page.locator('div .swiper-slide > player > video');
		const videoSrc = await videoEls.nth(0).getAttribute('src');

		expect(videoSrc?.includes('video.m3u8'));
	});
});
