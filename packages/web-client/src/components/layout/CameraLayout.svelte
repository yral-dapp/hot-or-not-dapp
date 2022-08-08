<script lang="ts">
$: innerHeight = window?.innerHeight;
</script>

<svelte:window on:resize="{() => (innerHeight = window?.innerHeight)}" />

<camera-layout
	style="height: 100vh; {innerHeight ? `height: ${innerHeight}px` : ''}"
	class="relative block h-full w-full overflow-hidden text-white"
>
	<slot name="content" />
	<div class="absolute inset-x-0 top-4 z-[6] flex items-center justify-center">
		<slot name="top" />
	</div>
	<div class="max-w-16 absolute inset-y-0 right-2 z-[5] h-full">
		<slot name="right-camera-controls" />
	</div>
	<div class="absolute inset-x-0 bottom-20 z-[5] w-full">
		<slot name="bottom-camera-controls" />
	</div>
	<div class="absolute inset-x-0 bottom-0 z-[5] h-16 bg-black/80">
		<slot name="bottom-navigation" />
	</div>
</camera-layout>
