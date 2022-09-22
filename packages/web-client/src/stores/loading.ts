import { writable } from 'svelte/store';

export const loadingAuthStatus = writable<boolean>(true);
