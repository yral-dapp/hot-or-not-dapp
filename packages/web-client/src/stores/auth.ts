import type { Identity } from '@dfinity/agent';
import type { AuthClient } from '@dfinity/auth-client';
import type { Principal } from '@dfinity/principal';
import { writable } from 'svelte/store';

export default writable<{
	client?: AuthClient;
	isLoggedIn: boolean;
	identity?: Identity;
	principal?: Principal;
	showLogin: boolean;
	userCanisterPrincipal?: Principal;
}>({
	client: undefined,
	isLoggedIn: false,
	showLogin: false
});
