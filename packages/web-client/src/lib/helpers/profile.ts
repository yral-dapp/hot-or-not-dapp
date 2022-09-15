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

export async function updateProfile() {
	const profile = await fetchProfile();
	if (profile) {
		userProfile.set({
			...profile,
			profile_stats: {
				lifetime_earnings: Number(profile.profile_stats.lifetime_earnings),
				hots_earned_count: Number(profile.profile_stats.hots_earned_count),
				nots_earned_count: Number(profile.profile_stats.nots_earned_count)
			}
		});
	} else {
		Log({ error: 'No profile fetched', from: '1 updateProfile' }, 'error');
	}
}
