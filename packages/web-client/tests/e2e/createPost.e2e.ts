import { HttpAgent } from '@dfinity/agent';
import canisterIds from '../../../../.dfx/local/canister_ids.json' assert { type: 'json' };
import { createActor as createUserIndexActor } from '../../declarations/user_index/index.js';
import { createActor as createIndividualUserActor } from '../../declarations/individual_user_template/index.js';
import fetch from 'isomorphic-fetch';
import { expect, test } from 'vitest';
import { identity } from './identity';

// can't use 127.0.0.1 or localhost
// isomorphic-fetch not required with node>=18

const agent = new HttpAgent({ host: 'http://0.0.0.0:4943', fetch, identity });
await agent.fetchRootKey();

test('Setup initial data', async () => {
	const userIndexActor = createUserIndexActor(canisterIds.user_index.local, { agent });
	const userCanisterPrincipal =
		await userIndexActor.get_requester_principals_canister_id_create_if_not_exists_and_optionally_allow_referrer(
			[]
		);

	const userCansiterId = userCanisterPrincipal.toText();
	console.log('user canisterId', userCansiterId);

	const individualUserActor = createIndividualUserActor(userCanisterPrincipal, { agent });

	const posts = await Promise.all(
		Array(10)
			.fill(0)
			.map((_, i) =>
				individualUserActor.add_post({
					description: `Test post #${i}`,
					hashtags: ['test', 'video', `${i}`],
					video_uid: `unique_video_id_${i}`,
					creator_consent_for_inclusion_in_hot_or_not: true
				})
			)
	);

	console.log(posts);

	expect(posts.length).toBe(10);
});
