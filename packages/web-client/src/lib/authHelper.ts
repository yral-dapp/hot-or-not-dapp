import { AuthClient } from '@dfinity/auth-client';
import { get } from 'svelte/store';
import { auth } from '../stores/auth';
import { userIndex } from './backend';

async function updateUserIndexCanister() {
	const userCanisterPrincipal = await userIndex().get_users_canister();
	console.log('updating user index canister', userCanisterPrincipal?.toText());
	const authStore = get(auth);
	auth.set({
		...authStore,
		userCanisterPrincipal
	});
}

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
		auth.set({
			client: authStore.client,
			isLoggedIn: true,
			identity,
			principal,
			showLogin: false
		});
	} else {
		auth.set({
			client: authStore.client,
			isLoggedIn: false,
			principal,
			showLogin: authStore.showLogin
		});
	}
	await updateUserIndexCanister();
}
