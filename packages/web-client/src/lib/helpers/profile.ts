import type { UserProfile } from '$canisters/individual_user_template/individual_user_template.did';
import Log from '$lib/utils/Log';
import userProfile from '$stores/userProfile';

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
		userProfile.set({
			...updateProfile,
			profile_stats: {
				lifetime_earnings: Number(updateProfile.profile_stats.lifetime_earnings),
				hots_earned_count: Number(updateProfile.profile_stats.hots_earned_count),
				nots_earned_count: Number(updateProfile.profile_stats.nots_earned_count)
			},
			updated_at: Date.now()
		});
	} else {
		Log({ error: 'No profile fetched', from: '1 updateProfile' }, 'error');
	}
}
