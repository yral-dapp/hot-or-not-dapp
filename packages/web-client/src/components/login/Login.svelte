<script lang="ts">
import Button from '$components/button/Button.svelte';
import IconButton from '$components/button/IconButton.svelte';
import CloseIcon from '$components/icons/CloseIcon.svelte';
import DfinityIcon from '$components/icons/DfinityIcon.svelte';
import { auth } from '$stores/auth';
import { fade } from 'svelte/transition';

export let hideNfid = false;

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

function getIdentityProviderURL(type: LoginType) {
	switch (type) {
		case 'ii':
			return process.env.NODE_ENV === 'development'
				? `http://${process.env.INTERNET_IDENTITY_CANISTER_ID}.localhost:8000`
				: 'https://identity.ic0.app/#authorize';
			break;
		case 'nfid':
			return NFID_AUTH_URL;
			break;
	}
}

async function handleLogin(type: LoginType) {
	await $auth.client?.login({
		onSuccess: () => handleSuccessfulLogin(type),
		onError: () => handleError(type),
		identityProvider: getIdentityProviderURL(type)
	});
}

function handleSuccessfulLogin(type: LoginType) {
	console.log('login successfull', type);
}

function handleError(type: LoginType) {
	console.log('error on login successfull', type);
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
		<div class="flex space-x-2">
			<span>Already have an account?</span>
			<span class="text-primary">Sign-in</span>
		</div>
	</div>
	<div class="absolute top-4 right-4">
		<IconButton on:click="{() => ($auth.showLogin = false)}">
			<CloseIcon class="h-8 w-8" />
		</IconButton>
	</div>
</login>
