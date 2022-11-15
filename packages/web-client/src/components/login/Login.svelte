<script lang="ts" context="module">
import { imageHost } from '$lib/utils/getDefaultImageUrl';

type LoginType = 'nfid' | 'ii';
const APPLICATION_NAME = encodeURI('Hot or Not');
const APPLICATION_LOGO_URL = encodeURI(`${imageHost}/5c66dd44-4bee-47e9-9348-9a20a3358200/public`);
const NFID_AUTH_URL =
	'https://nfid.one/authenticate/?applicationName=' +
	APPLICATION_NAME +
	'&applicationLogo=' +
	APPLICATION_LOGO_URL +
	'#authorize';
</script>

<script lang="ts">
import Button from '$components/button/Button.svelte';
import IconButton from '$components/button/IconButton.svelte';
import CloseIcon from '$components/icons/CloseIcon.svelte';
import DfinityIcon from '$components/icons/DfinityIcon.svelte';
import { registerEvent } from '$components/seo/GoogleAnalytics.svelte';
import { initializeAuthClient } from '$lib/helpers/auth';
import { getCanisterId } from '$lib/helpers/canisterId';
import Log from '$lib/utils/Log';
import { authHelper, authState } from '$stores/auth';
import userProfile from '$stores/userProfile';

export let hideNfid = false;

let error = '';
let loading = false;
function getIdentityProviderURL(type: LoginType) {
	switch (type) {
		case 'ii':
			return import.meta.env.NODE_ENV === 'development'
				? `http://${process.env.INTERNET_IDENTITY_CANISTER_ID}.localhost:4943`
				: 'https://identity.ic0.app/#authorize';
		case 'nfid':
			return NFID_AUTH_URL;
	}
}

async function handleLogin(type: LoginType) {
	registerEvent('login_cta', {
		type
	});
	loading = true;
	await $authHelper.client?.login({
		maxTimeToLive: BigInt(30 * 24 * 60 * 60 * 1000 * 1000 * 1000),
		onSuccess: () => handleSuccessfulLogin(type),
		onError: (e) => handleError(type, e),
		identityProvider: getIdentityProviderURL(type)
	});
}

async function handleSuccessfulLogin(type: LoginType) {
	Log({ type, from: '0 handleSuccessfulLogin' }, 'info');
	$authState.isLoggedIn = true;
	try {
		let canId: string | undefined = undefined;
		const principal = $authHelper.client?.getIdentity()?.getPrincipal();
		if (principal) {
			canId = await getCanisterId(principal.toString());
		}
		await initializeAuthClient();
		registerEvent(canId ? 'login' : 'sign_up', {
			'Login method': type,
			'Display Name': $userProfile.display_name,
			username: $userProfile.unique_user_name,
			userId: $userProfile.principal_id
		});
		loading = false;
		$authState.showLogin = false;
	} catch (_) {
		loading = false;
		error = 'Something went wrong. Please refresh the page and try login again.';
	}
}

function handleError(type: LoginType, e?: string) {
	error = 'Error while logging in. Please try again or use a different method';
	loading = false;
	console.warn('Error while logging in using,', type, ', Details: ', e);
}
</script>

<login class="fade-in absolute z-[100] block h-full w-full bg-black/90 text-white">
	<div class="flex h-full w-full flex-col items-center justify-center space-y-32 overflow-y-auto">
		<span class="text-3xl font-bold">Join Hot or Not</span>
		<div class="flex w-full max-w-md flex-col items-center space-y-4 px-8">
			<span>Create an account using</span>
			<Button
				disabled="{loading}"
				on:click="{async () => await handleLogin('ii')}"
				class="w-full space-x-2 py-3">
				<span> Internet Identity </span>
				<DfinityIcon class="w-8" />
			</Button>
			{#if !hideNfid}
				<Button
					disabled="{loading}"
					on:click="{async () => await handleLogin('nfid')}"
					type="secondary"
					class="w-full py-3">
					Google via NFID
				</Button>
			{/if}

			{#if error}
				<div class="text-xs text-red-600">
					{error}
				</div>
			{:else if loading}
				<span class="text-xs opacity-50">Please wait ...</span>
			{/if}
		</div>
	</div>
	<div class="absolute top-4 right-4">
		<IconButton on:click="{() => ($authState.showLogin = false)}">
			<CloseIcon class="h-8 w-8" />
		</IconButton>
	</div>
</login>
