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
import { get } from 'svelte/store';
import { getCanisterId } from './canisterId';

export interface UserProfileFollows extends UserProfile {
	i_follow: boolean;
}

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
			const { canisterIdb } = await import('$lib/utils/idb');
			canisterIdb.set(updateProfile.unique_user_name[0], authStateData.userCanisterId);
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

export async function fetchLovers(id: string, from: number) {
	try {
		const canId = await getCanisterId(id);
		const { individualUser } = await import('./backend');
		const res = await individualUser(Principal.from(canId)).get_principals_that_follow_me_paginated(
			BigInt(from),
			BigInt(from + 10)
		);
		if ('Ok' in res) {
			const populatedUsers = await populateProfiles(res.Ok);
			if (populatedUsers.error) {
				throw new Error(`Error while populating, ${JSON.stringify(populatedUsers)}`);
			}
			return {
				error: false,
				lovers: populatedUsers.posts,
				noMoreLovers: res.Ok.length < 10
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
					return { error: false, noMoreLovers: true, lovers: [] };
			}
		} else throw new Error(`Unknown response, ${JSON.stringify(res)}`);
	} catch (e) {
		Log({ error: e, from: '11 fetchPosts' }, 'error');
		return { error: true };
	}
}

async function populateProfiles(users: Principal[]) {
	try {
		const { individualUser } = await import('./backend');

		if (!users.length) {
			return { posts: [], error: false };
		}

		const res = await Promise.all(
			users.map(async (userId) => {
				const canId = await getCanisterId(userId.toText());
				if (canId) {
					const r = await individualUser(Principal.from(canId)).get_profile_details();

					return {
						...sanitizeProfile(r, userId.toText()),
						i_follow: await doIFollowThisUser(userId.toText())
					};
				}
			})
		);

		return { posts: res as UserProfileFollows[], error: false };
	} catch (e) {
		Log({ error: e, from: '11 populatePosts' }, 'error');
		return { error: true, posts: [] };
	}
}

export async function doIFollowThisUser(userId?: string, canId?: string | Principal) {
	if (!userId) return false;
	const { individualUser } = await import('./backend');
	return await individualUser(canId).get_following_status_do_i_follow_this_user(
		Principal.from(userId)
	);
}

export async function loveUser(userId: string) {
	const { individualUser } = await import('./backend');
	try {
		const res =
			await individualUser().update_principals_i_follow_toggle_list_with_principal_specified(
				Principal.from(userId)
			);
		if ('Ok' in res) {
			return true;
		} else {
			return false;
		}
	} catch (e) {
		Log({ error: e, from: '1 loveUser' }, 'error');
		return false;
	}
}
