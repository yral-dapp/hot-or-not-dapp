import { writable } from 'svelte/store';

export const playerState = writable<{
	initialized: boolean;
	muted: boolean;
	currentVideoUrl: string;
	currentHotOrNotIndex: number;
}>({
	initialized: false,
	muted: true,
	currentVideoUrl: '',
	currentHotOrNotIndex: 0
});
