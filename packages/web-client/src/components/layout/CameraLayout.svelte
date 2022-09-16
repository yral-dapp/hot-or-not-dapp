<script lang="ts">
import { browser } from '$app/environment';
$: innerHeight = browser ? window?.innerHeight : 0;
</script>

<svelte:window on:resize="{() => (innerHeight = window?.innerHeight)}" />

<camera-layout
	style="height: {innerHeight ? `${innerHeight}px` : '100vh;'}"
	class="relative block h-full w-full overflow-hidden text-white">
	<slot name="content" />
	<div class="absolute inset-x-0 top-4 z-[6] flex items-center justify-center">
		<slot name="top" />
	</div>
	<div class="max-w-16 absolute inset-y-0 right-2 z-[5] h-full">
		<slot name="right-camera-controls" />
	</div>
	<div class="absolute bottom-20 z-[5] h-24 w-full">
		<slot name="bottom-camera-controls" />
	</div>
	<div class="absolute inset-x-0 bottom-0 z-[5] h-16">
		<slot name="bottom-navigation" />
	</div>
</camera-layout>
