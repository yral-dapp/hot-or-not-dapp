import { HttpAgent } from '@dfinity/agent';
import canisterIds from '../../../../.dfx/local/canister_ids.json' assert { type: 'json' };
import { createActor as createUserIndexActor } from '../../declarations/user_index/index.js';
import { createActor as createIndividualUserActor } from '../../declarations/individual_user_template/index.js';
import fetch from 'isomorphic-fetch';
import { expect, test } from 'vitest';

// can't use 127.0.0.1 or localhost
// isomorphic-fetch not required with node>=18

const agent = new HttpAgent({ host: 'http://0.0.0.0:4943', fetch });
await agent.fetchRootKey();

test('Setup initial data', async () => {
	const userIndexActor = createUserIndexActor(canisterIds.user_index.local, { agent });
	const anonPrincipalId =
		await userIndexActor.get_requester_principals_canister_id_create_if_not_exists_and_optionally_allow_referrer(
			[]
		);

	expect(anonPrincipalId.toText()).toBeTruthy();

	// const anonCanisterId = anonPrincipalId.toText();

	const individualUserActor = createIndividualUserActor(
		canisterIds.individual_user_template.local,
		{ agent }
	);

	const post1 = await individualUserActor.add_post({
		description: 'Test post #2',
		hashtags: ['test', 'video', '2'],
		video_uid: 'unique_video_id',
		creator_consent_for_inclusion_in_hot_or_not: true
	});

	console.log({ post1 });

	expect(Number(post1)).toBeGreaterThan(-1);
});
