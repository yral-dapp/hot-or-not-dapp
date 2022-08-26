<script lang="ts">
export let testMode = false;
$: testClasses = testMode ? 'border-2 border-white/30' : '';
$: innerHeight = window?.innerHeight;
</script>

<svelte:window on:resize="{() => (innerHeight = window?.innerHeight)}" />

<home
	style="height: 100vh; {innerHeight ? `height: ${innerHeight}px` : ''}"
	class="relative block h-full w-full overflow-hidden text-white"
>
	<slot name="content" />
	<div class="absolute inset-x-0 top-0 z-[5] {testClasses}">
		<slot name="top" />
	</div>
	<div class="absolute inset-x-0 bottom-0 z-[5] max-h-16 {testClasses}">
		<slot name="bottom-navigation" />
	</div>
</home>
