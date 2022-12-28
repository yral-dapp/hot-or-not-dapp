import { describe, it, expect } from 'vitest';
import { HttpAgent } from '@dfinity/agent';
//@ts-ignore
import canisterIds from '../../../../../.dfx/local/canister_ids.json';
import { createActor as createUserIndexActor } from '../../../declarations/user_index/index.js';
import fetch from 'isomorphic-fetch';

// The two tests marked with concurrent will be run in parallel
describe('e2e test suite', () => {
	it('serial test', async () => {
		const agent = new HttpAgent({ host: 'http://0.0.0.0:4943', fetch });
		await agent.fetchRootKey();
		const userIndexActor = createUserIndexActor(canisterIds.user_index.local, { agent });
		const anonPrincipalId =
			await userIndexActor.get_requester_principals_canister_id_create_if_not_exists_and_optionally_allow_referrer(
				[]
			);
		expect(anonPrincipalId.toText()).toBeTruthy();
	});
});
