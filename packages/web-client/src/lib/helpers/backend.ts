import {
	createActor as createUserIndexActor,
	canisterId as userIndexCanisterId
} from '$canisters/user_index';
import { createActor as createIndividualUserActor } from '$canisters/individual_user_template';
import {
	createActor as createPostCacheActor,
	canisterId as postCacheCanisterId
} from '$canisters/post_cache';

import {
	createActor as createConfigurationActor,
	canisterId as configurationCanisterId
} from '$canisters/configuration';

import type { _SERVICE as _USER_INDEX_SERVICE } from '$canisters/user_index/user_index.did';
import type { _SERVICE as _INDIVIDUAL_USER_SERVICE } from '$canisters/individual_user_template/individual_user_template.did';
import type { _SERVICE as _POST_CACHE_SERVICE } from '$canisters/post_cache/post_cache.did';
import type { _SERVICE as _CONFIGURATION_SERVICE } from '$canisters/configuration/configuration.did';
import { authHelper, authState } from '$stores/auth';
import type { ActorSubclass } from '@dfinity/agent';
import { get } from 'svelte/store';
import { Principal } from '@dfinity/principal';

export const host =
	import.meta.env.NODE_ENV === 'development' ? 'http://localhost:4943' : 'https://ic0.app';

export type UserIndexActor = ActorSubclass<_USER_INDEX_SERVICE>;
export type IndividualUserActor = ActorSubclass<_INDIVIDUAL_USER_SERVICE>;
export type PostCacheActor = ActorSubclass<_POST_CACHE_SERVICE>;
export type ConfigurationActor = ActorSubclass<_CONFIGURATION_SERVICE>;

export function userIndex(): UserIndexActor {
	const authHelperData = get(authHelper);
	return createUserIndexActor(userIndexCanisterId as string, {
		agentOptions: { identity: authHelperData?.identity, host }
	}) as UserIndexActor;
}

export function individualUser(principal?: Principal | string): IndividualUserActor {
	const authHelperData = get(authHelper);
	const authStateData = get(authState);
	const canisterId = principal
		? principal instanceof Principal
			? principal
			: Principal.from(principal)
		: (authStateData.userCanisterId as string);
	return createIndividualUserActor(canisterId, {
		agentOptions: { identity: authHelperData?.identity, host }
	}) as IndividualUserActor;
}

export function postCache(): PostCacheActor {
	const authHelperData = get(authHelper);
	return createPostCacheActor(postCacheCanisterId as string, {
		agentOptions: { identity: authHelperData?.identity, host }
	}) as PostCacheActor;
}

export function configuration(): ConfigurationActor {
	return createConfigurationActor(configurationCanisterId, {
		agentOptions: { host }
	}) as ConfigurationActor;
}
