import type { UserProfile } from '$canisters/individual_user_template/individual_user_template.did';
import getDefaultImageUrl from '$lib/utils/getDefaultImageUrl';
import Log from '$lib/utils/Log';
import { generateRandomName } from '$lib/utils/randomUsername';
import { authState } from '$stores/auth';
import userProfile from '$stores/userProfile';
import { get } from 'svelte/store';

async function fetchProfile() {
	const { individualUser } = await import('./backend');
	try {
		return await individualUser().get_profile_details();
	} catch (e) {
		Log({ error: e, from: '1 fetchProfile' }, 'error');
	}
}

export async function updateProfile(profile?: UserProfile) {
	let updateProfile: UserProfile | undefined = undefined;
	if (profile) {
		updateProfile = profile;
	} else {
		updateProfile = await fetchProfile();
	}
	if (updateProfile) {
		const authStateData = get(authState);
		userProfile.set({
			username_set: !!updateProfile.unique_user_name[0],
			unique_user_name:
				updateProfile.unique_user_name[0] || generateRandomName('username', authStateData.idString),
			profile_picture_url:
				updateProfile.profile_picture_url[0] || getDefaultImageUrl(authStateData.idString),
			display_name:
				updateProfile.display_name[0] || generateRandomName('name', authStateData.idString),
			principal_id: updateProfile.principal_id[0],
			followers: updateProfile.followers,
			following: updateProfile.following,
			profile_stats: {
				hots_earned_count: Number(updateProfile.profile_stats.hots_earned_count) || 0,
				lifetime_earnings: Number(updateProfile.profile_stats.hots_earned_count) || 0,
				nots_earned_count: Number(updateProfile.profile_stats.hots_earned_count) || 0
			},
			updated_at: Date.now()
		});
	} else {
		Log({ error: 'No profile fetched', from: '1 updateProfile' }, 'error');
	}
}
