import { idlFactory } from '../../declarations/user_index/user_index.did.js';
import { Actor, HttpAgent } from '@dfinity/agent';
import canisterIds from '../../../../.dfx/local/canister_ids.json' assert { type: 'json' };
const canisterId = canisterIds.user_index.local;
import fetch from 'isomorphic-fetch';

const userIndexActor = Actor.createActor(idlFactory, {
	canisterId,
	agent: new HttpAgent({ host: 'http://localhost:4943', fetch })
});

const anonPrincipalId =
	await userIndexActor.get_requester_principals_canister_id_create_if_not_exists_and_optionally_allow_referrer(
		[]
	);
console.log(anonPrincipalId.toText());
// console.log(anonPrincipalId.toText()).toBe('2vsx-fae');
