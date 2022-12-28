import { tick } from 'svelte';
import { afterEach, expect, test } from 'vitest';
import Input from '../../../src/components/input/Input.svelte';

let host: HTMLElement;

afterEach(() => {
	host.remove();
});

test('[Component] Input', async () => {
	host = document.createElement('div');
	host.setAttribute('id', 'host');
	document.body.appendChild(host);
	const instance = new Input({
		target: host,
		props: {
			value: 'sample',
			type: 'text',
			disabled: true,
			maxlength: 20
		}
	});
	expect(instance).toBeTruthy();
	await tick();
	const inputEl = host.getElementsByTagName('input')[0];
	expect(inputEl.disabled).toBeTruthy();
	expect(inputEl.value).toBe('sample');
	expect(inputEl.type).toBe('text');
	expect(inputEl.maxLength).toBe(20);
});
