import { test, expect } from '@playwright/test';
import { userIndexActor } from './user_index';

test('contact canister', async () => {
	const anonPrincipalId =
		await userIndexActor.get_requester_principals_canister_id_create_if_not_exists_and_optionally_allow_referrer(
			[]
		);
	console.log(anonPrincipalId.toText());
	expect(anonPrincipalId.toText()).toBe('2vsx-fae');
});
