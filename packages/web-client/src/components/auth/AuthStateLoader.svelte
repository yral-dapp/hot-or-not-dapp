<script lang="ts">
import { AuthClient } from '@dfinity/auth-client';
import auth from '$stores/auth/auth';
import { authenticatedBackendActor } from '$stores/canisters/backendActor';
import { canisterId, createActor } from '$canisters/backend';
import { host } from '$lib/backend';
export let isAuthStateLoaded: boolean;

(async () => {
	const internetIdentityClient = await AuthClient.create();
	if ((await internetIdentityClient.isAuthenticated()) && canisterId) {
		$auth = {
			isLoggedIn: await internetIdentityClient.isAuthenticated(),
			authObject: internetIdentityClient.getIdentity()
		};
		$authenticatedBackendActor = createActor(canisterId, {
			agentOptions: {
				host,
				identity: internetIdentityClient.getIdentity()
			}
		});
	} else {
		$auth = {
			isLoggedIn: false
		};
	}
	isAuthStateLoaded = true;
})();
</script>
