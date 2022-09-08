<script lang="ts">
import { fade } from 'svelte/transition';
import { showOnboarding } from '$stores/hotOrNotOnboarding';
import left from '$assets/decore-left.png';
import right from '$assets/decore-right.png';
import StarsIcon from '$components/icons/StarsIcon.svelte';
import Button from '$components/button/Button.svelte';
</script>

{#if $showOnboarding}
	<onboarding
		out:fade|local="{{ duration: 500 }}"
		class="absolute z-[15] flex h-full w-full flex-col items-center justify-center space-y-32 bg-black/90 text-white"
	>
		<div class="pointer-events-none absolute top-0 flex w-full justify-between">
			<img alt="decore" src="{left}" class="select-none" />
			<img alt="decore" src="{right}" class="select-none" />
		</div>
		<div class="relative select-none text-center text-3xl font-bold ">
			<StarsIcon class="absolute -left-10 -top-12 h-24" />
			A new experience<br />awaits you
		</div>
		<div class="flex w-full flex-col space-y-6 px-8">
			<Button>Start Tutorial</Button>
			<button on:click="{() => ($showOnboarding = false)}" class="font-medium">Maybe Later</button>
		</div>
	</onboarding>
{/if}
