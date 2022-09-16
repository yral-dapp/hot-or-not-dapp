import type { Identity } from '@dfinity/agent';
import type { AuthClient } from '@dfinity/auth-client';
import type { Principal } from '@dfinity/principal';
import { writable as localWritable } from 'svelte-local-storage-store';
import { writable } from 'svelte/store';

export const authClient = writable<AuthClient | undefined>(undefined);

export const authStore = localWritable<{
	isLoggedIn: boolean;
	identity?: Identity;
	principal?: Principal;
	showLogin: boolean;
	userCanisterPrincipal?: Principal;
}>('auth-store', {
	isLoggedIn: false,
	showLogin: false
});
