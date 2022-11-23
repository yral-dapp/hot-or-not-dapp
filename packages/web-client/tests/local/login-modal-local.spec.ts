import { test, expect } from '@playwright/test';
import { Actor } from '@dfinity/agent';
import { idlFactory } from '../../declarations/user_index';

test('[Local] Modal for login works on menu page', async ({ page }) => {
	await page.goto('http://localhost:5173/menu');

	const loginBtn = page.locator('text=Login');
	Actor.createActor(idlFactory, {
		agentOptions: {
			host: 'http://127.0.0.1:4943'
		})

	await expect(loginBtn).toBeVisible({ timeout: 20_000 });

	await expect(page.getByText('Join Hot or Not')).toBeHidden();

	await loginBtn.click();

	await expect(page.getByText('Join Hot or Not')).toBeVisible();
});
