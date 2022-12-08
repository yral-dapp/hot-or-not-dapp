import Log from '$lib/utils/Log';
import { AuthClient } from '@dfinity/auth-client';
import { get } from 'svelte/store';
import { authState, authHelper, referralId } from '$stores/auth';
import { updateProfile } from './profile';
import { loadingAuthStatus } from '$stores/loading';
import { setUser } from './sentry';
import { Principal } from '@dfinity/principal';
import { userIndex } from './backend';

async function updateUserIndexCanister(): Promise<{
	error: boolean;
	error_details?: 'SIGNUP_NOT_ALLOWED' | 'OTHER';
}> {
	try {
		const isSignupAllowed = false;

		if (!isSignupAllowed) {
			return { error: true, error_details: 'SIGNUP_NOT_ALLOWED' };
		}

		const referralStore = get(referralId);
		const referral: [] | [Principal] = referralStore.principalId
			? [Principal.from(referralStore.principalId)]
			: [];

		const userCanisterPrincipal =
			await userIndex().get_requester_principals_canister_id_create_if_not_exists_and_optionally_allow_referrer(
				referral
			);

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
			const { canisterIdb } = await import('$lib/utils/idb');
			canisterIdb.set(authStateData.idString, userCanisterPrincipal.toText());
		}
		return { error: false };
	} catch (e) {
		Log({ error: e, from: '1 updateUserIndexCanister' }, 'error');
		return { error: true, error_details: 'OTHER' };
	}
}

export async function initializeAuthClient(): Promise<{ error: boolean }> {
	loadingAuthStatus.set(true);
	const authStateData = get(authState);
	const authHelperData = get(authHelper);
	let client: AuthClient | undefined = undefined;
	if (!authHelperData.client) {
		client = await AuthClient.create({
			idleOptions: {
				disableIdle: true,
				disableDefaultIdleCallback: true
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

		const res = await updateUserIndexCanister();
		if (res.error && res.error_details === 'SIGNUP_NOT_ALLOWED') {
			return { error: true };
		}
		await updateProfile();
		setUser(principal?.toText());
	} else {
		authState.set({
			isLoggedIn: false,
			idString: principal?.toText(),
			showLogin: authStateData.showLogin
		});

		setUser();

		authHelper.set({
			client,
			identity,
			idPrincipal: principal
		});

		const res = await updateUserIndexCanister();
		if (res.error && res.error_details === 'SIGNUP_NOT_ALLOWED') {
			return { error: true };
		}
	}
	loadingAuthStatus.set(false);
	return { error: false };
}
