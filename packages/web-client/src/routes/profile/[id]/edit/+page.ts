export const ssr = false;

import { individualUser } from '$lib/helpers/backend';
import { updateProfile } from '$lib/helpers/profile';
import Log from '$lib/utils/Log';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
	const id = params.id;
	if (!id) {
		throw redirect(307, '/404');
	}
	try {
		const profile = await individualUser(undefined, fetch).get_profile_details();
		const me = profile.unique_user_name[0] === id || profile.principal_id.toText() === id;
		if (!me) {
			throw redirect(307, `/profile/${params.id}`);
		}
		updateProfile(profile);
		return {
			username_set: !!profile.unique_user_name[0],
			username: profile.unique_user_name[0],
			displayName: profile.display_name[0],
			imgSrc: profile.profile_picture_url[0],
			userPrincipal: profile.principal_id
		};
	} catch (e) {
		Log({ error: e, from: '1 fetchProfile' }, 'error');
		throw redirect(307, `/profile/${params.id}`);
	}
};
