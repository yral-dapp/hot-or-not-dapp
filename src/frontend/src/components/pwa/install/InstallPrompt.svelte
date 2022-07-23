<script lang="ts">
import { INSTALL_PROMPT_DISMISSAL_DEFAULT_MILLISECOND_LENGTH } from '$lib/constants';

let deferredPromptEvent: BeforeInstallPromptEvent | undefined;
let shouldShowInstallPrompt: boolean = false;

const getLastPromptShownTimestamp = (): number => {
	const installPromptLastShownAt = window.localStorage.getItem('installPromptLastShownAt');

	if (installPromptLastShownAt) return Number(installPromptLastShownAt);
	else return 0;
};

function beforeInstallPrompt(event: BeforeInstallPromptEvent) {
	deferredPromptEvent = event;

	// default dismissal time of 1 day
	const alreadyShownToday =
		Date.now() - getLastPromptShownTimestamp() <
		INSTALL_PROMPT_DISMISSAL_DEFAULT_MILLISECOND_LENGTH;

	shouldShowInstallPrompt = !alreadyShownToday;
}

function appInstalled() {
	// Hide the app-provided install promotion
	shouldShowInstallPrompt = false;
	// Clear the deferredPrompt so it can be garbage collected
	deferredPromptEvent = undefined;

	window.localStorage.removeItem('installPromptLastShownAt');

	window.screen.orientation.lock('portrait');
	// Optionally, send analytics event to indicate successful install
	console.log('PWA was installed');
}
</script>

<svelte:window
	on:appinstalled="{appInstalled}"
	on:beforeinstallprompt|preventDefault="{beforeInstallPrompt}"
/>

{#if shouldShowInstallPrompt}
	<section class="mx-auto grid grid-rows-3 rounded-lg bg-red-50 p-2">
		<span class="text-center">
			Visit us often? Install the app. We don't use space on your device
		</span>
		<button
			class="mx-4 my-2 rounded-lg bg-red-500 py-2 text-lg text-white hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-600 active:bg-red-700"
			on:click="{async () => {
				if (deferredPromptEvent) {
					// Hide the app provided install promotion
					shouldShowInstallPrompt = false;
					// Show the install prompt
					deferredPromptEvent.prompt();
					// Wait for the user to respond to the prompt
					const { outcome } = await deferredPromptEvent.userChoice;
					// Optionally, send analytics event with outcome of user choice
					console.log(`User response to the install prompt: ${outcome}`);
					// We've used the prompt, and can't use it again, throw it away
					deferredPromptEvent = undefined;
				}
			}}"
		>
			Install
		</button>
		<button
			class="mx-4 my-2 rounded-lg bg-red-100 text-red-400 hover:bg-red-200 focus:outline-none focus:ring focus:ring-red-200 active:bg-red-300"
			on:click="{() => {
				shouldShowInstallPrompt = false;
				window.localStorage.setItem('installPromptLastShownAt', Date.now().toString());
			}}"
		>
			Not Now
		</button>
	</section>
{/if}
