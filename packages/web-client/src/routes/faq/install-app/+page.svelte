<script lang="ts">
import Button from '$components/button/Button.svelte';
import IconButton from '$components/button/IconButton.svelte';
import CaretLeftIcon from '$components/icons/CaretLeftIcon.svelte';
import HomeLayout from '$components/layout/HomeLayout.svelte';
import { deferredPrompt } from '$stores/deferredPrompt';

async function promptInstall() {
	if ($deferredPrompt) {
		$deferredPrompt.prompt();
		const { outcome } = await $deferredPrompt.userChoice;
		if (outcome === 'accepted') {
			$deferredPrompt = undefined;
		}
	}
}
</script>

<svelte:head>
	<title>Install App | FAQ | Hot or Not</title>
</svelte:head>

<HomeLayout>
	<svelte:fragment slot="top">
		<div class="flex w-full items-center justify-center bg-black py-4 shadow-xl shadow-black/50">
			FAQs
			<div class="absolute top-4 left-4">
				<IconButton href="/menu">
					<CaretLeftIcon class="h-5 w-5" />
				</IconButton>
			</div>
		</div>
	</svelte:fragment>
	<svelte:fragment slot="content">
		<div
			class="flex h-full w-full flex-col items-center space-y-4 overflow-hidden overflow-y-scroll py-20 px-8">
			<div class="w-full">How to install Hot or Not app</div>
			<Button on:click="{promptInstall}">Install</Button>
		</div>
	</svelte:fragment>
</HomeLayout>
