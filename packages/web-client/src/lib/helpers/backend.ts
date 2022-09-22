import {
	createActor as createUserIndexActor,
	canisterId as userIndexCanisterId
} from '$canisters/user_index';
import { createActor as createIndividualUserActor } from '$canisters/individual_user_template';
import type { _SERVICE as _USER_INDEX_SERVICE } from '$canisters/user_index/user_index.did';
import type { _SERVICE as _INDIVIDUAL_USER_SERVICE } from '$canisters/individual_user_template/individual_user_template.did';
import { authHelper, authState } from '$stores/auth';
import type { ActorSubclass } from '@dfinity/agent';
import { get } from 'svelte/store';
import type { Principal } from '@dfinity/principal';

export const host =
	process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'https://ic0.app';

export type UserIndexActor = ActorSubclass<_USER_INDEX_SERVICE>;
export type IndividualUserCanister = ActorSubclass<_INDIVIDUAL_USER_SERVICE>;

const userIndexCanister: {
	actor?: UserIndexActor;
	loginState: boolean;
} = {
	loginState: false
};

const individualUserCanister: {
	actor?: IndividualUserCanister;
	loginState: boolean;
} = {
	loginState: false
};

export function userIndex(): UserIndexActor {
	const authStateData = get(authState);
	if (userIndexCanister.actor && userIndexCanister.loginState === authStateData.isLoggedIn) {
		return userIndexCanister.actor;
	} else {
		const authHelperData = get(authHelper);
		userIndexCanister.actor = createUserIndexActor(userIndexCanisterId, {
			agentOptions: { identity: authHelperData?.identity, host }
		}) as UserIndexActor;
		userIndexCanister.loginState = authStateData.isLoggedIn;
		return userIndexCanister.actor;
	}
}

export function individualUser(principal?: Principal): IndividualUserCanister {
	const authStateData = get(authState);
	if (
		!principal &&
		individualUserCanister.actor &&
		individualUserCanister.loginState == authStateData.isLoggedIn
	) {
		return individualUserCanister.actor;
	} else {
		const authHelperData = get(authHelper);
		if (principal) {
			return createIndividualUserActor(principal.toText(), {
				agentOptions: { identity: authHelperData?.identity, host }
			}) as IndividualUserCanister;
		} else {
			individualUserCanister.actor = createIndividualUserActor(authStateData.userCanisterId, {
				agentOptions: { identity: authHelperData?.identity, host }
			}) as IndividualUserCanister;
			individualUserCanister.loginState = authStateData.isLoggedIn;
			return individualUserCanister.actor;
		}
	}
}
