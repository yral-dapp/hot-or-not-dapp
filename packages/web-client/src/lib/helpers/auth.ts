import Log from '$lib/utils/Log';
import { AuthClient } from '@dfinity/auth-client';
import { get } from 'svelte/store';
import { auth } from '../../stores/auth';

async function updateUserIndexCanister() {
	const { userIndex } = await import('./backend');
	try {
		const userCanisterPrincipal = await userIndex().get_user_canister_id_from_user_principal_id();
		Log(
			{
				userCanisterPrincipal: userCanisterPrincipal?.toText(),
				from: '0 updateUserIndexCanister'
			},
			'info'
		);
		const authStore = get(auth);
		auth.set({
			...authStore,
			userCanisterPrincipal
		});
	} catch (e) {
		Log({ error: e, from: '1 updateUserIndexCanister' }, 'error');
	}
}

export async function initializeAuthClient(): Promise<void> {
	let authStore = get(auth);
	if (!authStore.client) {
		const authClient = await AuthClient.create({
			idleOptions: {
				disableIdle: true
			}
		});
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
