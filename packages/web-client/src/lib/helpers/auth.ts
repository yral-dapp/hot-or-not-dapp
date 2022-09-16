import Log from '$lib/utils/Log';
import { AuthClient } from '@dfinity/auth-client';
import { get } from 'svelte/store';
import { authStore, authClient } from '$stores/auth';
import { updateProfile } from './profile';

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
		const authStoreValue = get(authStore);
		authStore.set({
			...authStoreValue,
			userCanisterPrincipal
		});
		await updateProfile();
	} catch (e) {
		Log({ error: e, from: '1 updateUserIndexCanister' }, 'error');
	}
}

export async function initializeAuthClient(): Promise<void> {
	const authStoreValue = get(authStore);
	let authClientValue = get(authClient);
	if (!authClientValue) {
		const newAuthClient = await AuthClient.create({
			idleOptions: {
				disableIdle: true
			}
		});
		authClient.set(newAuthClient);
		authClientValue = newAuthClient;
	}
	const identity = authClientValue?.getIdentity();
	const principal = await identity?.getPrincipal();
	if (await authClientValue?.isAuthenticated()) {
		authStore.set({
			isLoggedIn: true,
			identity,
			principal,
			showLogin: false
		});
	} else {
		authStore.set({
			isLoggedIn: false,
			principal,
			showLogin: authStoreValue.showLogin
		});
	}
	await updateUserIndexCanister();
}
