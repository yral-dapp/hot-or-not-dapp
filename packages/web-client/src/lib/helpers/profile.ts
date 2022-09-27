import type {
	GetPostsOfUserProfileError,
	PostDetailsForFrontend,
	UserProfileDetailsForFrontend
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

export function sanitizeProfile(
	profile: UserProfileDetailsForFrontend,
	userId: string
): UserProfile {
	return {
		username_set: !!profile.unique_user_name[0],
		unique_user_name: profile.unique_user_name[0] || generateRandomName('username', userId),
		profile_picture_url: profile.profile_picture_url[0] || getDefaultImageUrl(userId),
		display_name: profile.display_name[0] || generateRandomName('name', userId),
		principal_id: profile.principal_id.toText(),
		followers_count: Number(profile.followers_count),
		following_count: Number(profile.followers_count),
		profile_stats: {
			hots_earned_count: Number(profile.profile_stats.hots_earned_count) || 0,
			lifetime_earnings: Number(profile.profile_stats.hots_earned_count) || 0,
			nots_earned_count: Number(profile.profile_stats.hots_earned_count) || 0
		},
		updated_at: Date.now()
	};
}

export async function updateProfile(profile?: UserProfileDetailsForFrontend) {
	let updateProfile: UserProfileDetailsForFrontend | undefined = undefined;
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

type ProfilePostsResponse =
	| {
			error: true;
	  }
	| {
			error: false;
			posts: PostDetailsForFrontend[];
			noMorePosts: boolean;
	  };

export async function fetchPosts(id: string, from: number): Promise<ProfilePostsResponse> {
	try {
		const canId = await getCanisterId(id);
		const { individualUser } = await import('./backend');
		const res = await individualUser(
			Principal.from(canId)
		).get_posts_of_this_user_profile_with_pagination(BigInt(from), BigInt(from + 10));
		if ('Ok' in res) {
			return {
				error: false,
				posts: res.Ok,
				noMorePosts: res.Ok.length < 10
			};
		} else if ('Err' in res) {
			type UnionKeyOf<U> = U extends U ? keyof U : never;
			type errors = UnionKeyOf<GetPostsOfUserProfileError>;
			const err = Object.keys(res.Err)[0] as errors;
			switch (err) {
				case 'ExceededMaxNumberOfItemsAllowedInOneRequest':
				case 'InvalidBoundsPassed':
					return { error: true };
				case 'ReachedEndOfItemsList':
					return { error: false, noMorePosts: true, posts: [] };
			}
		} else throw new Error(`Unknown response, ${JSON.stringify(res)}`);
	} catch (e) {
		Log({ error: e, from: '11 fetchPosts' }, 'error');
		return { error: true };
	}
}
