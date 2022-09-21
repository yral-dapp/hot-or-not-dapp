import type { Identity } from '@dfinity/agent';
import type { AuthClient } from '@dfinity/auth-client';
import type { Principal } from '@dfinity/principal';
import { writable as localWritable } from 'svelte-local-storage-store';
import { writable } from 'svelte/store';

export const authHelper = writable<{
	client?: AuthClient;
	identity?: Identity;
	idPrincipal?: Principal;
	userCanisterPrincipal?: Principal;
}>({});

export const authState = localWritable<{
	isLoggedIn: boolean;
	idString?: string;
	userCanisterId?: string;
	showLogin: boolean;
}>('auth-state', {
	isLoggedIn: false,
	showLogin: false
});
