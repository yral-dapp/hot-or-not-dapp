import { browser } from '$app/environment';
import { getCanisterId } from '$lib/helpers/idb';
import Log from '$lib/utils/Log';
import userProfile from '$stores/userProfile';
import { Principal } from '@dfinity/principal';
import { redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';

import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	if (!browser) {
		return;
	}
	const id = params.id;
	if (!id) {
		Log({ from: '1 noId' }, 'warn');
		throw redirect(307, '/404');
	}
	const userProfileData = get(userProfile);
	if (id === userProfileData.unique_user_name) {
		return { me: true, profile: userProfileData };
	} else {
		const canId = await getCanisterId(id);
		if (!canId) {
			Log({ from: '1 noCanId' }, 'warn');
			throw redirect(307, '/404');
		}
		console.log({ canId });
		const individualUser = (await import('$lib/helpers/backend')).individualUser(
			Principal.from(canId)
		);
		const profile = await individualUser.get_profile_details();
		return { me: false, profile };
	}
};
