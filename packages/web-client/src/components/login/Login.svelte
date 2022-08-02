<script lang="ts">
import Button from '$components/button/Button.svelte';
import { auth } from '$stores/auth';

export let hideNfid = false;

type LoginType = 'nfid' | 'ii';
const DFINITY_LOGO =
	'https://aws1.discourse-cdn.com/business4/uploads/dfn/original/1X/c6f5dd4f7a21c825f82566b7c7528e5505734f77.png';
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

<login class="absolute z-[10] block h-full w-full bg-black/90 text-white">
	<div class="flex h-full w-full flex-col items-center justify-center space-y-32 overflow-y-auto">
		<span class="text-3xl font-bold">Join GoBazzinga</span>
		<div class="flex w-full max-w-md flex-col items-center space-y-4 px-8">
			<span>Create an account using</span>
			<Button on:click="{() => handleLogin('ii')}" class="w-full space-x-2 py-2.5">
				<span> Internet Identity </span>
				<img class="w-8" alt="Login using internet identity" src="{DFINITY_LOGO}" />
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
</login>
