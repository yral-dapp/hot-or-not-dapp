import {
	createActor as createUserIndexActor,
	canisterId as userIndexCanisterId
} from '$canisters/user_index';
import { createActor as createIndividualUserActor } from '$canisters/individual_user_template';
import {
	createActor as createPostCacheActor,
	canisterId as postCacheCanisterId
} from '$canisters/post_cache';
import type { _SERVICE as _USER_INDEX_SERVICE } from '$canisters/user_index/user_index.did';
import type { _SERVICE as _INDIVIDUAL_USER_SERVICE } from '$canisters/individual_user_template/individual_user_template.did';
import type { _SERVICE as _POST_CACHE_SERVICE } from '$canisters/post_cache/post_cache.did';
import { authHelper, authState } from '$stores/auth';
import type { ActorSubclass } from '@dfinity/agent';
import { get } from 'svelte/store';
import type { Principal } from '@dfinity/principal';

export const host =
	process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'https://ic0.app';

export type UserIndexActor = ActorSubclass<_USER_INDEX_SERVICE>;
export type IndividualUserActor = ActorSubclass<_INDIVIDUAL_USER_SERVICE>;
export type PostCacheActor = ActorSubclass<_POST_CACHE_SERVICE>;

export function userIndex(): UserIndexActor {
	const authHelperData = get(authHelper);
	return createUserIndexActor(userIndexCanisterId as string, {
		agentOptions: { identity: authHelperData?.identity, host }
	}) as UserIndexActor;
}

export function individualUser(principal?: Principal): IndividualUserActor {
	const authHelperData = get(authHelper);
	const authStateData = get(authState);
	return createIndividualUserActor(
		principal ? principal.toText() : (authStateData.userCanisterId as string),
		{
			agentOptions: { identity: authHelperData?.identity, host }
		}
	) as IndividualUserActor;
}

export function postCache(): PostCacheActor {
	const authHelperData = get(authHelper);
	return createPostCacheActor(postCacheCanisterId as string, {
		agentOptions: { identity: authHelperData?.identity, host }
	}) as PostCacheActor;
}
