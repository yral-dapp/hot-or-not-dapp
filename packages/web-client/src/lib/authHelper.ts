import { AuthClient } from '@dfinity/auth-client';
import { get } from 'svelte/store';
import { auth } from '../stores/auth';
import { user_index } from '$canisters/user_index';

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
	if (await authStore.client?.isAuthenticated()) {
		const userCanister = await user_index.get_users_canister();
		auth.set({
			client: authStore.client,
			isLoggedIn: true,
			identity,
			principal,
			showLogin: false,
			userCanister
		});
	} else {
		auth.set({
			client: authStore.client,
			isLoggedIn: false,
			principal,
			showLogin: authStore.showLogin
		});
	}
	console.log('auth updated', get(auth));
}
