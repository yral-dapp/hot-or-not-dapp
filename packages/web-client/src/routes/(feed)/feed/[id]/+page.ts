// import { browser } from '$app/environment';
// import { getCanisterId, isPrincipal } from '$lib/helpers/idb';
// import Log from '$lib/utils/Log';
// import userProfile from '$stores/userProfile';
// import { Principal } from '@dfinity/principal';
// import { redirect } from '@sveltejs/kit';
// import { get } from 'svelte/store';
import type { PageLoad } from './$types';

// export async function validateId(id?: string) {
// 	if (!id) return { error: true };
// 	const idSeparate = id.split(':');
// 	console.log(idSeparate[0], await isPrincipal('rdmx6-jaaaa-aaaaa-aaadq-cai'));
// 	if (
// 		idSeparate.length == 1 ||
// 		!idSeparate[0] ||
// 		!idSeparate[1] ||
// 		isNaN(Number(idSeparate[1])) ||
// 		!(await isPrincipal(idSeparate[0]))
// 	) {
// 		return { error: true };
// 	}

// 	return { canisterId: idSeparate[0], postId: idSeparate[1], error: false };
// }

export const load: PageLoad = async () => {
	// 	if (!browser) {
	// 		return;
	// 	}
	// 	const { canisterId, postId, error } = await validateId(params.id);
	// 	console.log({ canisterId, postId, error });
	// 	if (error) {
	// 		Log({ from: '1 noId' }, 'warn');
	// 		throw redirect(307, '/404');
	// 	}
	// 	const id = params.id.split(':');
	// 	const userProfileData = get(userProfile);
	// 	if (id === userProfileData.unique_user_name || id === userProfileData.principal_id) {
	// 		return { me: true, profile: userProfileData };
	// 	} else {
	// 		const canId = await getCanisterId(id);
	// 		if (!canId) {
	// 			Log({ from: '1 noCanId' }, 'warn');
	// 			throw redirect(307, '/404');
	// 		}
	// 		Log({ canId, from: '0 canId' }, 'info');
	// 		const individualUser = (await import('$lib/helpers/backend')).individualUser;
	// 		const profile = await individualUser(Principal.from(canId)).get_profile_details();
	// 		return { me: false, fetchedProfile: profile };
	// 	}
};
