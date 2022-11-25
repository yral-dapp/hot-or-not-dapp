import { writable } from 'svelte/store';

export const playerState = writable<{
	initialized: boolean;
	muted: boolean;
	currentFeedUrl: string;
	currentHotOrNotUrl: string;
}>({
	initialized: false,
	muted: true,
	currentFeedUrl: '',
	currentHotOrNotUrl: ''
});
