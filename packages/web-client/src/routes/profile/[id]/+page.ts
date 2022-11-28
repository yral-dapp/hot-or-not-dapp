export const ssr = false;

import { individualUser } from '$lib/helpers/backend';
import { getCanisterId } from '$lib/helpers/canisterId';
import { sanitizeProfile } from '$lib/helpers/profile';
import Log from '$lib/utils/Log';
import userProfile from '$stores/userProfile';
import { Principal } from '@dfinity/principal';
import { error, redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	const id = params.id;

	if (!id) {
		Log({ from: '1 load profile', id: params.id }, 'warn');
		throw redirect(307, '/menu');
	}

	const userProfileData = get(userProfile);
	if (id === userProfileData.unique_user_name || id === userProfileData.principal_id) {
		return { me: true, profile: userProfileData };
	} else {
		const canId = await getCanisterId(id);
		if (!canId) {
			Log({ from: '1 noCanId' }, 'warn');
			throw error(404, "Couldn't find canister Id");
		}
		Log({ canId, from: '0 canId' }, 'info');
		const fetchedProfile = await individualUser(Principal.from(canId)).get_profile_details();
		const profile = sanitizeProfile(fetchedProfile, id);
		return { me: false, profile, canId };
	}
};
