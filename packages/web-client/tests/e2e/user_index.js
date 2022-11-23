import { Actor, HttpAgent } from '@dfinity/agent';
import fetch from 'isomorphic-fetch';
import canisterIds from '../../../../.dfx/local/canister_ids.json' assert { type: 'json' };
import { idlFactory } from '../../declarations/user_index/index.js';

export const createActor = async (canisterId, options) => {
	const agent = new HttpAgent({ ...options?.agentOptions, host: 'http://127.0.0.1:4943' });
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
export const userIndexActor = await createActor(userIndexCanister, {
	agentOptions: { host: 'http://127.0.0.1:4943', fetch }
});
