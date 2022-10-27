import { browser } from '$app/environment';
import { getCanisterId } from '$lib/helpers/canisterId';
import Log from '$lib/utils/Log';
import userProfile from '$stores/userProfile';
import { Principal } from '@dfinity/principal';
import { redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	if (!browser) return;

	try {
		const pid = params.postId;
		const id = params.id;
		let me = false;
		console.log('here');
		if (!pid || isNaN(Number(pid))) {
			Log({ from: '1 posts/[vid] load', pid, id }, 'warn');
			throw redirect(307, '/profile');
		}

		const canId = await getCanisterId(id);
		if (!canId) {
			throw redirect(307, '/profile');
		}

		const userProfileData = get(userProfile);

		if (id === userProfileData.unique_user_name || id === userProfileData.principal_id) me = true;

		const individualUser = (await import('$lib/helpers/backend')).individualUser;
		const video = await individualUser(Principal.from(canId)).get_individual_post_details_by_id(
			BigInt(pid)
		);
		if (!video) {
			throw redirect(307, '/profile');
		}
		return { me, video, publisherId: canId };
	} catch (e) {
		Log({ from: '1 posts/[vid] load', error: e }, 'warn');
		throw redirect(307, '/profile');
	}
};
