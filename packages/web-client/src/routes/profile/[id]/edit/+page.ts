import { browser } from '$app/environment';
import userProfile from '$stores/userProfile';
import { redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';

import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	if (!browser) {
		return;
	}
	const id = params.id;
	if (!id) {
		throw redirect(307, '/404');
	}
	const userProfileData = get(userProfile);
	if (id === userProfileData.unique_user_name) {
		return { profile: userProfileData };
	} else {
		throw redirect(307, `/profile/${params.id}`);
	}
};
