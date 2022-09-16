import {
	createActor as createUserIndexActor,
	canisterId as userIndexCanisterId
} from '$canisters/user_index';
import { createActor as createIndividualUserActor } from '$canisters/individual_user_template';
import type { _SERVICE as _USER_INDEX_SERVICE } from '$canisters/user_index/user_index.did';
import type { _SERVICE as _INDIVIDUAL_USER_SERVICE } from '$canisters/individual_user_template/individual_user_template.did';
import { authStore } from '$stores/auth';
import type { ActorSubclass } from '@dfinity/agent';
import { get } from 'svelte/store';

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
	const authStoreValue = get(authStore);
	if (!userIndexCanister.actor || userIndexCanister.loginState != authStoreValue.isLoggedIn) {
		userIndexCanister.actor = createUserIndexActor(userIndexCanisterId, {
			agentOptions: { identity: authStoreValue?.identity, host }
		}) as UserIndexActor;
		userIndexCanister.loginState = authStoreValue.isLoggedIn;
		return userIndexCanister.actor;
	} else return userIndexCanister.actor;
}

export function individualUser(): IndividualUserCanister {
	const authStoreValue = get(authStore);
	if (
		!individualUserCanister.actor ||
		individualUserCanister.loginState != authStoreValue.isLoggedIn
	) {
		individualUserCanister.actor = createIndividualUserActor(
			authStoreValue.userCanisterPrincipal?.toText(),
			{
				agentOptions: { identity: authStoreValue?.identity, host }
			}
		) as IndividualUserCanister;
		individualUserCanister.loginState = authStoreValue.isLoggedIn;
		return individualUserCanister.actor;
	} else return individualUserCanister.actor;
}
