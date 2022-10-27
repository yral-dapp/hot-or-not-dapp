export const ssr = false;

import { authState } from '$stores/auth';
import userProfile from '$stores/userProfile';
import { redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';

export const load = async () => {
	const userProfileData = get(userProfile);
	const authStateData = get(authState);

	if (authStateData.isLoggedIn) {
		throw redirect(
			307,
			`/profile/${userProfileData.unique_user_name || userProfileData.principal_id}`
		);
	} else throw redirect(307, '/menu');
};
