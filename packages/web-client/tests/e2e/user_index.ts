// actor.js
import { Actor, HttpAgent } from '@dfinity/agent';
import fetch from 'isomorphic-fetch';
import canisterIds from '../../../../.dfx/local/canister_ids.json';
import { idlFactory } from '../../declarations/user_index/index';
import type { _SERVICE } from '../../declarations/user_index/user_index.did';
import type { ActorSubclass } from '@dfinity/agent';

export const createActor = async (canisterId, options) => {
	const agent = new HttpAgent({ ...options?.agentOptions });
	await agent.fetchRootKey();

	// Creates an actor with using the candid interface and the HttpAgent
	return Actor.createActor(idlFactory, {
		agent,
		canisterId,
		...options?.actorOptions
	});
};

export const userIndexCanister = canisterIds.user_index.local;

//@ts-ignore
export const userIndexActor = (await createActor(userIndexCanister, {
	agentOptions: { host: 'http://127.0.0.1:4943', fetch }
})) as ActorSubclass<_SERVICE>;
