import { describe, it, expect } from 'vitest';
import { HttpAgent } from '@dfinity/agent';
import canisterIds from '../../../../.dfx/local/canister_ids.json' assert { type: 'json' };
import { createActor as createUserIndexActor } from '../../declarations/user_index/index.js';
import { createActor as createIndividualUserActor } from '../../declarations/individual_user_template/index.js';
import fetch from 'isomorphic-fetch';
import { identity } from './identity';

const cloudflareVideoUid = [
	'f2037700b94c4dd981ff3d1fa3e0e0e7',
	'e104de2eb66c408a8f22f25bc833b292',
	'a3f3961b0e29419987190c3fbd8913cf',
	'c2c4f67dbdeb42dfba81cd307d532147',
	'2fb1932c535e40d9af6fa9a6fedb6296',
	'b28f783634ef4e9b8025d45a11c7ead7',
	'b7cd450602f74f45aef7e0eb9f89a9d2',
	'a5e053c3d21b4af0824707bd4e54b3bd',
	'9a3fab71d9154d6e960193df369b392a',
	'52ca81e7dd8040029c56dabab5f7cdb5'
];

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
	it('Setup initial data', async () => {
		const agent = new HttpAgent({ host: 'http://0.0.0.0:4943', fetch, identity });
		await agent.fetchRootKey();

		const userIndexActor = createUserIndexActor(canisterIds.user_index.local, { agent });
		const userCanisterPrincipal =
			await userIndexActor.get_requester_principals_canister_id_create_if_not_exists_and_optionally_allow_referrer(
				[]
			);
		const userCansiterId = userCanisterPrincipal.toText();
		console.log('user canisterId', userCansiterId);
		const individualUserActor = createIndividualUserActor(userCanisterPrincipal, { agent });

		const posts = await Promise.all(
			cloudflareVideoUid.map((video_uid, i) =>
				individualUserActor.add_post({
					description: `Test post #${i + 1}`,
					hashtags: ['test', 'video', `${i + 1}`],
					video_uid,
					creator_consent_for_inclusion_in_hot_or_not: true
				})
			)
		);

		console.log('posts array', posts);

		expect(posts.length).toBe(10);
	});
});
