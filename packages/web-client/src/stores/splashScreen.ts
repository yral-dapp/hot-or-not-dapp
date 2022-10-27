import { writable } from 'svelte/store';

export const showSplashScreen = writable<boolean>(true);

let timeout;

export function hideSplashScreen(timeoutMs: number = 2000) {
	if (timeout) clearTimeout(timeout);
	timeout = setTimeout(() => {
		showSplashScreen.set(false);
	}, timeoutMs);
}
