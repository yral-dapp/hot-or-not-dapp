import { writable } from 'svelte-local-storage-store';

export default writable<string | null>('go-back', null);
