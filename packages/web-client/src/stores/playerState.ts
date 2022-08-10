import { writable } from 'svelte/store';

export const playerState = writable<{
	initialized: boolean;
	muted: boolean;
}>({
	initialized: false,
	muted: true
});
