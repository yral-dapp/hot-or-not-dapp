import { writable } from 'svelte/store';

export const playerState = writable<{
	initialized: boolean;
	muted: boolean;
	currentVideosIndex: number;
	currentHotOrNotIndex: number;
}>({
	initialized: false,
	muted: true,
	currentVideosIndex: 0,
	currentHotOrNotIndex: 0
});
