import { tick } from 'svelte';
import { afterEach, expect, test } from 'vitest';
import GoogleAnalytics from '../../src/components/seo/GoogleAnalytics.svelte';

let host: HTMLElement;

afterEach(() => {
	host.remove();
});

test('[Component] Google Analytics', async () => {
	host = document.createElement('div');
	host.setAttribute('id', 'host');
	document.body.appendChild(host);
	const instance = new GoogleAnalytics({ target: host });
	expect(instance).toBeTruthy();
	const btn = host.getElementsByTagName('button')[0];
	btn.click();
	await tick();
	expect(host.innerHTML).toContain('-');
	btn.click();
	await tick();
	expect(host.innerHTML).toContain('+');
});
