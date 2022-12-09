import { get } from 'svelte/store';
import { page } from '$app/stores';
import { authState, authHelper, referralId } from '$stores/auth';
import { isPrincipal } from './isPrincipal';
import { initializeAuthClient } from '$lib/helpers/auth';

export function handleParams() {
	const pageStore = get(page);
	if (!pageStore) return;

	const showLogin = pageStore.url.searchParams.get('login');

	if (showLogin) {
		const ogData = get(authState);
		authState.set({
			...ogData,
			showLogin: true
		});
	}

	const refId = pageStore.url.searchParams.get('refId');
	if (refId && isPrincipal(refId)) {
		referralId.set({
			principalId: refId,
			time: new Date().getTime()
		});
	} else {
		const refStore = get(referralId);
		if (refStore && refStore.time) {
			const now = new Date().getTime();
			if (now - refStore.time > 172800000) {
				//older than two days
				referralId.set({});
			}
		}
	}

	const logout = pageStore.url.searchParams.get('logout');
	if (logout) {
		const authHelperState = get(authHelper);
		authHelperState.client?.logout();
		initializeAuthClient();
	}

	const test = pageStore.url.searchParams.get('test');
	if (test) {
		const authStateData = get(authState);
		authState.set({
			t: true,
			...authStateData
		});
		initializeAuthClient();
	}
}
