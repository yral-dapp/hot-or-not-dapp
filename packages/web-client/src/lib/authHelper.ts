import { AuthClient } from '@dfinity/auth-client';
import { get } from 'svelte/store';
import { auth } from '../stores/auth';
import { userIndex } from './backend';

export async function initializeAuthClient(): Promise<void> {
	let authStore = get(auth);
	if (!authStore.client) {
		const authClient = await AuthClient.create();
		auth.update((o) => {
			return { ...o, client: authClient };
		});
		authStore = get(auth);
	}
	const identity = authStore.client?.getIdentity();
	const principal = await identity?.getPrincipal();
	const userCanisterPrincipal = await userIndex().get_users_canister();

	if (await authStore.client?.isAuthenticated()) {
		auth.set({
			client: authStore.client,
			isLoggedIn: true,
			identity,
			principal,
			showLogin: false,
			userCanisterPrincipal
		});
	} else {
		auth.set({
			client: authStore.client,
			isLoggedIn: false,
			principal,
			showLogin: authStore.showLogin,
			userCanisterPrincipal
		});
	}
}
