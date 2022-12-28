import { tick } from 'svelte';
import { afterEach, expect, test } from 'vitest';
import InputBox from '../../../src/components/input/InputBox.svelte';

let host: HTMLElement;

afterEach(() => {
	host.remove();
});

test('[Component] Input Box', async () => {
	host = document.createElement('div');
	host.setAttribute('id', 'host');
	document.body.appendChild(host);
	const instance = new InputBox({
		target: host,
		props: {
			value: 'sample',
			rows: 5,
			disabled: true
		}
	});
	expect(instance).toBeTruthy();
	await tick();
	const inputEl = host.getElementsByTagName('textarea')[0];
	expect(inputEl.disabled).toBeTruthy();
	expect(inputEl.value).toBe('sample');
	expect(inputEl.rows).toBe(5);
});
