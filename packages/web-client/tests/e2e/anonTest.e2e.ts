import { HttpAgent } from '@dfinity/agent';
import canisterIds from '../../../../.dfx/local/canister_ids.json' assert { type: 'json' };
import { createActor as createUserIndexActor } from '../../declarations/user_index/index.js';
import fetch from 'isomorphic-fetch';
import { expect, test } from 'vitest';

// can't use 127.0.0.1 or localhost
// isomorphic-fetch not required with node>=18

const agent = new HttpAgent({ host: 'http://0.0.0.0:4943', fetch });
await agent.fetchRootKey();

test('Test anon identity canister', async () => {
	const userIndexActor = createUserIndexActor(canisterIds.user_index.local, { agent });
	const anonPrincipalId =
		await userIndexActor.get_requester_principals_canister_id_create_if_not_exists_and_optionally_allow_referrer(
			[]
		);

	expect(anonPrincipalId.toText()).toBe('renrk-eyaaa-aaaaa-aaada-cai');
});
