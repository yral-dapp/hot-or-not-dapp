import { HttpAgent } from '@dfinity/agent';
import canisterIds from '../../../../.dfx/local/canister_ids.json' assert { type: 'json' };
const canisterId = canisterIds.user_index.local;
import { createActor } from '../../declarations/user_index/index.js';
import fetch from 'isomorphic-fetch';

// can't use 127.0.0.1 & localhost
// isomorphic-fetch not required with node>=18
const agent = new HttpAgent({ host: 'http://0.0.0.0:4943', fetch });
await agent.fetchRootKey();

try {
	const userIndexActor = createActor(canisterId, { agent });
	const anonPrincipalId =
		await userIndexActor.get_requester_principals_canister_id_create_if_not_exists_and_optionally_allow_referrer(
			[]
		);

	console.log(anonPrincipalId.toText());
} catch (e) {
	console.error('ERROR::::::', e);
}
