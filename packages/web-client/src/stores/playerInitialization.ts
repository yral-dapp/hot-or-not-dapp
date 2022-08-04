import { writable } from 'svelte/store';

export const playerInitialized = writable<boolean>(false);
