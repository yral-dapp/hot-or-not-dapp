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
		throw redirect(307, '/menu');
	}

	const userProfileData = get(userProfile);

	if (id === userProfileData.unique_user_name || id === userProfileData.principal_id) {
		return { me: true, profile: userProfileData };
	} else {
		const canId = await getCanisterId(id);
		if (!canId) {
			Log({ from: '1 noCanId' }, 'warn');
			throw new Error("Couldn't find canister Id");
		}
		Log({ canId, from: '0 canId' }, 'info');
		const individualUser = (await import('$lib/helpers/backend')).individualUser;
		const profile = await individualUser(Principal.from(canId)).get_profile_details();
		return { me: false, fetchedProfile: profile };
	}
};
