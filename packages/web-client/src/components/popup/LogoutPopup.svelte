<script lang="ts">
import Button from '$components/button/Button.svelte';
import Popup from './Popup.svelte';
import { auth } from '$stores/auth';
import { initializeAuthClient } from '$lib/authHelper';

export let show = false;
let loading = false;

async function handleLogout() {
	loading = true;
	$auth.isLoggedIn = false;
	loading = false;
	show = false;
	await $auth.client?.logout();
	await initializeAuthClient();
}
</script>

<Popup showCloseButton bind:show>
	<div class="flex flex-col space-y-4">
		<div>Are you sure you want to logout?</div>
		<Button disabled="{loading}" on:click="{handleLogout}">Yes, I'm sure</Button>
		<Button
			on:click="{() => (show = false)}"
			disabled="{loading}"
			type="secondary"
			class="border-black/50 text-black/70"
		>
			Go back
		</Button>
	</div>
</Popup>
