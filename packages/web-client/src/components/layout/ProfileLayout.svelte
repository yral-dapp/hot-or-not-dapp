<script lang="ts">
export let testMode = false;
$: testClasses = testMode ? 'border-2 border-white/30' : '';
$: innerHeight = window?.innerHeight;
</script>

<svelte:window on:resize="{() => (innerHeight = window?.innerHeight)}" />

<profile-layout
	style="height: 100vh; {innerHeight ? `height: ${innerHeight}px` : ''}"
	class="relative flex h-full w-full flex-col overflow-hidden text-white"
>
	<div
		class="relative z-[2] flex h-12 w-full items-center justify-center bg-black py-8 shadow-xl shadow-black/50 {testClasses}"
	>
		<div class="absolute left-4 top-4">
			<slot name="top-left" />
		</div>
		<slot name="top-center" />
		<div class="absolute right-4 top-4">
			<slot name="top-right" />
		</div>
	</div>
	<slot name="content" />
</profile-layout>
