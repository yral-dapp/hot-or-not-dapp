import type { PostPopulated } from '$lib/helpers/feed';
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

export const homeFeedVideos = writable<PostPopulated[]>([]);

export const hotOrNotFeedVideos = writable<PostPopulated[]>([]);
