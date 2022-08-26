<script lang="ts">
export let testMode = false;
$: testClasses = testMode ? 'border-2 border-white/30' : '';
$: innerHeight = window?.innerHeight;
</script>

<svelte:window on:resize="{() => (innerHeight = window?.innerHeight)}" />

<upload-layout
	style="{innerHeight ? `height: ${innerHeight}px` : '100vh'}"
	class="relative flex h-full w-full flex-col overflow-hidden text-white"
>
	<div
		class="relative z-[2] flex h-12 w-full items-center justify-center bg-black py-8 shadow-xl shadow-black/50 {testClasses}"
	>
		<div class="absolute left-4 top-4">
			<slot name="top-left" />
		</div>
		<slot name="top-center" />
	</div>
	<slot name="content" />
	<div class="absolute inset-x-0 bottom-0 z-[2] {testClasses}">
		<slot name="bottom" />
	</div>
</upload-layout>
