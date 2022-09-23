import type {
	GetPostsOfUserProfileError,
	UserProfile as ServerUserProfile
} from '$canisters/individual_user_template/individual_user_template.did';
import getDefaultImageUrl from '$lib/utils/getDefaultImageUrl';
import Log from '$lib/utils/Log';
import { generateRandomName } from '$lib/utils/randomUsername';
import { authState } from '$stores/auth';
import userProfile, { type UserProfile } from '$stores/userProfile';
import { Principal } from '@dfinity/principal';
import { set } from 'idb-keyval';
import { get } from 'svelte/store';
import { getCanisterId } from './idb';

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
		followers: [],
		following: [],
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
		if (updateProfile.unique_user_name[0]) {
			set(updateProfile.unique_user_name[0], authStateData.userCanisterId);
		}
		Log({ profile: get(userProfile), from: '0 updateProfile' }, 'info');
	} else {
		Log({ error: 'No profile fetched', from: '1 updateProfile' }, 'error');
	}
}

export async function fetchPosts(id: string, skipCount: number = 0) {
	try {
		const canId = await getCanisterId(id);
		const { individualUser } = await import('./backend');
		const res = await individualUser(
			Principal.from(canId)
		).get_posts_of_this_user_profile_with_pagination(BigInt(skipCount), BigInt(10));
		if ('Ok' in res) {
			return { error: false, posts: res.Ok };
		} else if ('Err' in res) {
			type UnionKeyOf<U> = U extends U ? keyof U : never;
			type errors = UnionKeyOf<GetPostsOfUserProfileError>;
			const err = Object.keys(res.Err)[0] as errors;
			switch (err) {
				case 'ExceededMaxNumberOfPostsAllowedInOneRequest':
					return { error: true, posts: [] };
				case 'InvalidBoundsPassed':
					return { error: true, posts: [] };
				case 'LowerBoundExceedsTotalPosts':
					return { error: false, noMorePosts: true, posts: [] };
			}
		} else throw new Error(`Unknown response, ${JSON.stringify(res)}`);
	} catch (e) {
		Log({ error: e, from: '11 fetchPosts' }, 'error');
		return { error: true, posts: [] };
	}
}
