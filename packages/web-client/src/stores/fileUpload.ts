import { writable } from 'svelte/store';

export const fileList = writable<FileList | null>(null);
