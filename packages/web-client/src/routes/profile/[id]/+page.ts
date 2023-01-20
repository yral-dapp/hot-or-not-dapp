export const ssr = false;

import { individualUser } from '$lib/helpers/backend';
import { getCanisterId } from '$lib/helpers/canisterId';
import { sanitizeProfile, updateProfile } from '$lib/helpers/profile';
import Log from '$lib/utils/Log';
import { authState } from '$stores/auth';
import userProfile from '$stores/userProfile';
import { Principal } from '@dfinity/principal';
import { error, redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
	const id = params.id;

	if (!id) {
		Log({ from: '1 load profile', id: params.id }, 'warn');
		throw redirect(307, '/menu');
	}

	const userProfileData = get(userProfile);
	const authStateData = get(authState);

	const isUserAnon = id === '2vxsx-fae' || id === 'rajeshmoundekar';

	const isLoggedInAsAnon = authStateData.userCanisterId === 'qcdty-nyaaa-aaaao-aaloq-cai';

	if (
		authStateData.isLoggedIn &&
		(id === userProfileData.unique_user_name || id === userProfileData.principal_id)
	) {
		if (isUserAnon && isLoggedInAsAnon) {
			// Logged in as an anon user
			throw redirect(307, '/menu?logout=true');
		}
		await updateProfile();
		const updatedProfile = get(userProfile);
		return { me: true, profile: updatedProfile };
	} else {
		if (isUserAnon) {
			// Logged in as an anon user
			throw redirect(307, '/menu');
		}
		const canId = await getCanisterId(id);
		if (!canId) {
			Log({ from: '1 noCanId' }, 'warn');
			throw error(404, "Couldn't find canister Id");
		}
		Log({ canId, from: '0 canId' }, 'info');
		const fetchedProfile = await individualUser(Principal.from(canId), fetch).get_profile_details();
		const profile = sanitizeProfile(fetchedProfile, id);
		return { me: false, profile, canId };
	}
};
