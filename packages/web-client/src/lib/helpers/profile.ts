import type { UserProfile as ServerUserProfile } from '$canisters/individual_user_template/individual_user_template.did';
import getDefaultImageUrl from '$lib/utils/getDefaultImageUrl';
import Log from '$lib/utils/Log';
import { generateRandomName } from '$lib/utils/randomUsername';
import { authState } from '$stores/auth';
import userProfile, { type UserProfile } from '$stores/userProfile';
import { get } from 'svelte/store';

async function fetchProfile() {
	const { individualUser } = await import('./backend');
	try {
		return await individualUser().get_profile_details();
	} catch (e) {
		Log({ error: e, from: '1 fetchProfile' }, 'error');
	}
}

export function sanitizeProfile(profile: ServerUserProfile, userId: string): UserProfile {
	return {
		username_set: !!profile.unique_user_name[0],
		unique_user_name: profile.unique_user_name[0] || generateRandomName('username', userId),
		profile_picture_url: profile.profile_picture_url[0] || getDefaultImageUrl(userId),
		display_name: profile.display_name[0] || generateRandomName('name', userId),
		principal_id: profile.principal_id,
		followers: profile.followers,
		following: profile.following,
		profile_stats: {
			hots_earned_count: Number(profile.profile_stats.hots_earned_count) || 0,
			lifetime_earnings: Number(profile.profile_stats.hots_earned_count) || 0,
			nots_earned_count: Number(profile.profile_stats.hots_earned_count) || 0
		},
		updated_at: Date.now()
	};
}

export async function updateProfile(profile?: ServerUserProfile) {
	let updateProfile: ServerUserProfile | undefined = undefined;
	if (profile) {
		updateProfile = profile;
	} else {
		updateProfile = await fetchProfile();
	}
	if (updateProfile) {
		const authStateData = get(authState);
		userProfile.set({
			...sanitizeProfile(updateProfile, authStateData.idString || 'random')
		});
		Log({ profile: get(userProfile), from: '0 updateProfile' }, 'info');
	} else {
		Log({ error: 'No profile fetched', from: '1 updateProfile' }, 'error');
	}
}
