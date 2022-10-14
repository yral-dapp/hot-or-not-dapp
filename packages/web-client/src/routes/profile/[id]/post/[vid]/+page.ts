import { browser } from '$app/environment';
import { getCanisterId } from '$lib/helpers/canisterId';
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

	try {
		const vid = params.vid;
		const id = params.id;
		let me = false;
		console.log('here');
		if (!vid || isNaN(Number(vid))) {
			Log({ from: '1 noVid' }, 'warn');
			throw redirect(307, '/profile');
		}

		const canId = await getCanisterId(id);
		if (!canId) {
			Log({ from: '1 noCanId' }, 'warn');
			throw redirect(307, '/profile');
		}

		Log({ canId, from: '0 canId' }, 'info');

		const userProfileData = get(userProfile);

		if (id === userProfileData.unique_user_name || id === userProfileData.principal_id) {
			me = true;
		}

		const individualUser = (await import('$lib/helpers/backend')).individualUser;
		const video = await individualUser(Principal.from(canId)).get_individual_post_details_by_id(
			BigInt(vid)
		);
		console.log('returning', video);
		if (!video) {
			console.log('hi');
			throw redirect(307, '/profile');
		}
		return { me, video, publisherId: canId };
	} catch (e) {
		console.log('e', e);
		throw redirect(307, '/profile');
	}
};
