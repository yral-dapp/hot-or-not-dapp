import { writable } from 'svelte/store';

export const fileList = writable<FileList | null>(null);
export const fileBlob = writable<Blob | null>(null);
