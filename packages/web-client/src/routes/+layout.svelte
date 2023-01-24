<script lang="ts">
import '../css/app.css';
import { onMount } from 'svelte';
import { authState } from '$stores/auth';
import navigateBack from '$stores/navigateBack';
import { registerEvent } from '$components/seo/GA.svelte';
import userProfile from '$stores/userProfile';
import { deferredPrompt } from '$stores/deferredPrompt';
import NetworkStatus from '$components/network-status/NetworkStatus.svelte';

onMount(() => ($navigateBack = null));

// beforeNavigate(({ from, to }) => {
// 	if (
// 		ignoredPaths.some((path) => from?.url.pathname.includes(path)) ||
// 		ignoredPaths.some((path) => to?.url.pathname.includes(path))
// 	)
// 		return;
// 	$navigateBack = from?.url.pathname ?? null;
// });
</script>

<svelte:window
	on:appinstalled="{() => {
		registerEvent('pwa_installed', {
			canister_id: $authState.userCanisterId,
			userId: $userProfile.principal_id
		});
	}}"
	on:beforeinstallprompt="{(e) => {
		deferredPrompt.set(e);
	}}" />

<NetworkStatus />

<alpha-ribbon
	class="pointer-events-none absolute -right-10 top-2 z-[50] flex w-28 rotate-45 items-center justify-center overflow-hidden bg-primary py-0.5 px-1 text-[0.5rem] font-bold uppercase text-white opacity-60">
	Alpha
</alpha-ribbon>

<div class="safe-bottom relative h-full w-full overflow-hidden overflow-y-auto">
	<slot />
</div>
