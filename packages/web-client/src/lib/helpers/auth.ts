import Log from '$lib/utils/Log';
import { AuthClient, LocalStorage } from '@dfinity/auth-client';
import { get } from 'svelte/store';
import { authState, authHelper } from '$stores/auth';
import { updateProfile } from './profile';
import { loadingAuthStatus } from '$stores/loading';
import { set } from 'idb-keyval';
import { DelegationChain, DelegationIdentity, Ed25519KeyIdentity } from '@dfinity/identity';
import type { Identity, SignIdentity } from '@dfinity/agent';

async function updateUserIndexCanister() {
	const { userIndex } = await import('./backend');
	try {
		const userCanisterPrincipal =
			await userIndex().get_user_index_create_if_not_exists_else_return_canister_id_for_embedded_user_principal_id();
		Log(
			{
				userCanisterPrincipal: userCanisterPrincipal?.toText(),
				from: '0 updateUserIndexCanister'
			},
			'info'
		);
		const authStateData = get(authState);
		const authHelperData = get(authHelper);
		authHelper.set({
			...authHelperData,
			userCanisterPrincipal
		});
		authState.set({
			...authStateData,
			userCanisterId: userCanisterPrincipal?.toText()
		});
		if (authStateData.isLoggedIn && authStateData.idString && userCanisterPrincipal) {
			set(authStateData.idString, userCanisterPrincipal.toText());
		}
	} catch (e) {
		Log({ error: e, from: '1 updateUserIndexCanister' }, 'error');
	}
}

async function checkIdentityInLocal() {
	try {
		const storage = new LocalStorage('ic-');
		const identityKey: string | null = await storage.get('identity');
		const delegationChain: string | null = await storage.get('delegation');
		if (identityKey && delegationChain) {
			const chain: DelegationChain = DelegationChain.fromJSON(delegationChain);
			const key: Ed25519KeyIdentity = Ed25519KeyIdentity.fromJSON(identityKey);
			const identity: Identity = DelegationIdentity.fromDelegation(key, chain);
			return identity as SignIdentity;
		} else {
			return undefined;
		}
	} catch (_) {
		return undefined;
	}
}

export async function initializeAuthClient(): Promise<void> {
	loadingAuthStatus.set(true);
	const authStateData = get(authState);
	const authHelperData = get(authHelper);
	let client: AuthClient | undefined = undefined;
	if (!authHelperData.client) {
		client = await AuthClient.create({
			identity: await checkIdentityInLocal(),
			idleOptions: {
				disableIdle: true
			}
		});
	} else {
		client = authHelperData.client;
	}
	const identity = client?.getIdentity();
	const principal = await identity?.getPrincipal();
	if (await client?.isAuthenticated()) {
		authState.set({
			userCanisterId: authStateData.userCanisterId,
			isLoggedIn: true,
			idString: principal?.toText(),
			showLogin: authStateData.showLogin
		});

		authHelper.set({
			client,
			userCanisterPrincipal: authHelperData.userCanisterPrincipal,
			identity,
			idPrincipal: principal
		});
	} else {
		authState.set({
			isLoggedIn: false,
			idString: principal?.toText(),
			showLogin: authStateData.showLogin
		});

		authHelper.set({
			client,
			identity,
			idPrincipal: principal
		});
	}
	await updateUserIndexCanister();
	await updateProfile();
	loadingAuthStatus.set(false);
}
