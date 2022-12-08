<script lang="ts">
import Button from '$components/button/Button.svelte';
import WaitlistIcon from '$components/icons/WaitlistIcon.svelte';
import { handleParams } from '$lib/utils/params';
import { onMount } from 'svelte';

onMount(() => {
	handleParams();
});
</script>

<svelte:head>
	<title>Waitlist | Hot or Not</title>
</svelte:head>

<div
	class="flex overflow-hidden absolute h-full overflow-y-scroll w-full flex-col items-center pt-16 pb-32 gap-8 px-12">
	<WaitlistIcon class="w-64 shrink-0" />
	<div class="flex flex-col gap-2 items-center">
		<div class="text-2xl">Sorry</div>
		<div class="text-center opacity-70">
			We have received an overwherlming amount of onboarding and we are trying to accomodate
			everyone here. Currently, all the slots are full
		</div>
	</div>
	<div class="text-center">
		We appreciate your interest and request you to fill out your email address in the form below to
		get notified when a slot is avaiable.
	</div>

	<iframe
		class="w-full h-[36rem] shrink-0"
		title="Waitlist Form"
		src="https://docs.google.com/forms/d/e/1FAIpQLScb7VqGcptH3-_42ord-o7KfilvIF2r69mbjgBq5QQKkxWzMw/viewform?embedded=true"
		frameborder="0"
		marginheight="0"
		marginwidth="0">Loading…</iframe>

	<Button href="/">Go Home</Button>
</div>
