import { writable } from 'svelte/store';

export const fileToUpload = writable<File | Blob | null>(null);
