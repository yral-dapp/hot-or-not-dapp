import { get } from 'svelte/store';
import { page } from '$app/stores';
import { authState, referralId } from '$stores/auth';
import { isPrincipal } from './isPrincipal';

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
	}
}
