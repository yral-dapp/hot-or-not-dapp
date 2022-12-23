import { afterEach, expect, test } from 'vitest';
import Button from '../../src/components/button/Button.svelte';

let host: HTMLElement;

afterEach(() => {
	host.remove();
});

test('[Component] Button', async () => {
	host = document.createElement('div');
	host.setAttribute('id', 'host');
	document.body.appendChild(host);
	const hrefInstance = new Button({
		target: host,
		props: {
			href: 'https://hotornot.wtf',
			preload: true
		}
	});
	expect(hrefInstance).toBeTruthy();
	const href = host.getElementsByTagName('a')[0];
	expect(href.href).toBe('https://hotornot.wtf/');
	expect(href.getAttribute('data-sveltekit-preload-data')).toBeTruthy();

	const buttonInstance = new Button({
		target: host,
		props: {
			disabled: true
		}
	});

	expect(buttonInstance).toBeTruthy();
	const button = host.getElementsByTagName('button')[0];
	expect(button.disabled).toBeTruthy();
});
