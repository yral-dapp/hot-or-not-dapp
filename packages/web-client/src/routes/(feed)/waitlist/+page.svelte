<script lang="ts">
import Button from '$components/button/Button.svelte';
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
	<div class="flex flex-col gap-4 items-center">
		<div class="text-3xl font-bold">Logins paused</div>
		<div class="text-center opacity-70">
			Due to sudden high demand, new user registrations are temporarily closed. You can continue to
			browse the platform's hundreds of videos while we implement the global timer and resume
			logins! Thank you for bearing with us.
		</div>
	</div>

	<Button href="/">Continue browsing</Button>

	<div class="text-center">Register to get notified when logins resume</div>

	<iframe
		class="w-full h-[36rem] shrink-0"
		title="Waitlist Form"
		src="https://docs.google.com/forms/d/e/1FAIpQLScb7VqGcptH3-_42ord-o7KfilvIF2r69mbjgBq5QQKkxWzMw/viewform?embedded=true"
		frameborder="0"
		marginheight="0"
		marginwidth="0">Loading…</iframe>
</div>
