import { test, expect } from '@playwright/test';
import { createActor } from '../../declarations/user_index/index.js';
import canisterIds from '../../../../.dfx/local/canister_ids.json' assert { type: 'json' };
const canisterId = canisterIds.hello.user_index;

const userIndexActor = createActor(canisterId, {
	agentOptions: {
		host: 'http://127.0.0.1:4943'
	}
});

test('contact canister', async () => {
	const anonPrincipalId =
		await userIndexActor.get_requester_principals_canister_id_create_if_not_exists_and_optionally_allow_referrer(
			[]
		);
	console.log(anonPrincipalId.toText());
	expect(anonPrincipalId.toText()).toBe('2vsx-fae');
});
