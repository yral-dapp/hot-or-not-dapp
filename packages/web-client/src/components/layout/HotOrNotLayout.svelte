<script lang="ts">
import { browser } from '$app/environment';

export let testMode = false;

$: testClasses = testMode ? 'border-2 border-white/30' : '';
$: innerHeight = browser ? window?.innerHeight : 0;
</script>

<svelte:window on:resize="{() => (innerHeight = window?.innerHeight)}" />

<home
	style="height: {innerHeight ? `${innerHeight}px` : '100vh;'}"
	class="relative block h-full w-full overflow-hidden text-white"
	on:keyup>
	<slot name="content" />
	<div class="absolute inset-x-0 top-0 z-[5] {testClasses}">
		<slot name="top" />
	</div>
	<div class="pointer-events-none absolute inset-x-0 bottom-0 z-[5] max-h-48 {testClasses}">
		<slot name="bottom-navigation" />
	</div>
</home>
