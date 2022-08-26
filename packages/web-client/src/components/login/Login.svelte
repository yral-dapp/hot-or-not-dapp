<script lang="ts" context="module">
type LoginType = 'nfid' | 'ii';
const APPLICATION_NAME = encodeURI('Hot or Not');
const APPLICATION_LOGO_URL = encodeURI(
	'https://static.wixstatic.com/media/1f4d25_d43585ecba2d4eeeb72a344a1b5896ea~mv2.png'
);
const NFID_AUTH_URL =
	'https://nfid.one/authenticate/?applicationName=' +
	APPLICATION_NAME +
	'&applicationLogo=' +
	APPLICATION_LOGO_URL +
	'#authorize';
</script>

<script lang="ts">
import { user_index } from '$canisters/user_index';

import Button from '$components/button/Button.svelte';
import IconButton from '$components/button/IconButton.svelte';
import CloseIcon from '$components/icons/CloseIcon.svelte';
import DfinityIcon from '$components/icons/DfinityIcon.svelte';
import { initializeAuthClient } from '$lib/authHelper';
import { auth } from '$stores/auth';
import { fade } from 'svelte/transition';

export let hideNfid = false;

let error = '';
function getIdentityProviderURL(type: LoginType) {
	switch (type) {
		case 'ii':
			return process.env.NODE_ENV === 'development'
				? `http://${process.env.INTERNET_IDENTITY_CANISTER_ID}.localhost:8000`
				: 'https://identity.ic0.app/#authorize';
		case 'nfid':
			return NFID_AUTH_URL;
	}
}

async function handleLogin(type: LoginType) {
	const canisterId = await user_index.get_users_canister();
	console.log('users canister before login:', canisterId.toText());
	await $auth.client?.login({
		onSuccess: () => handleSuccessfulLogin(type),
		onError: (e) => handleError(type, e),
		identityProvider: getIdentityProviderURL(type)
	});
}

async function handleSuccessfulLogin(type: LoginType) {
	$auth.showLogin = false;
	$auth.isLoggedIn = true;
	initializeAuthClient();
	const canisterId = await user_index.get_users_canister();
	console.log('users canister after login:', canisterId.toText());
}

function handleError(type: LoginType, e?: string) {
	error = 'Error while logging in. Please try again or use a different method';
	console.warn('Error while logging in using,', type, ', Details: ', e);
}
</script>

<login transition:fade|local class="absolute z-[10] block h-full w-full bg-black/90 text-white">
	<div class="flex h-full w-full flex-col items-center justify-center space-y-32 overflow-y-auto">
		<span class="text-3xl font-bold">Join GoBazzinga</span>
		<div class="flex w-full max-w-md flex-col items-center space-y-4 px-8">
			<span>Create an account using</span>
			<Button on:click="{() => handleLogin('ii')}" class="w-full space-x-2 py-2.5">
				<span> Internet Identity </span>
				<DfinityIcon class="w-8" />
			</Button>
			{#if !hideNfid}
				<Button on:click="{() => handleLogin('nfid')}" type="secondary" class="w-full py-3">
					Google via NFID
				</Button>
			{/if}
		</div>
		{#if error}
			<div class="text-xs text-red-600">
				{error}
			</div>
		{/if}
	</div>
	<div class="absolute top-4 right-4">
		<IconButton on:click="{() => ($auth.showLogin = false)}">
			<CloseIcon class="h-8 w-8" />
		</IconButton>
	</div>
</login>
