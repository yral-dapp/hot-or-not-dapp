import { writable } from 'svelte/store';

export const showSplashScreen = writable<boolean>(true);

export function hideSplashScreen() {
	setTimeout(() => {
		showSplashScreen.set(false);
	}, 2000);
}
