<script lang="ts">
export let testMode = false;
$: testClasses = testMode ? 'border-2 border-white/30' : '';
</script>

<home class="relative block h-full w-full overflow-hidden text-white">
	<slot name="video" />
	<div class="absolute inset-x-0 top-4 z-[5] flex items-center justify-center {testClasses}">
		<slot name="top" />
	</div>
	<div class="max-w-16 absolute right-4 bottom-20 z-[5] {testClasses}">
		<slot name="bottom-right-controls" />
	</div>
	<div class="absolute inset-x-0 bottom-20 left-4 right-16 z-[5] w-min {testClasses}">
		<slot name="bottom-description" />
	</div>
	<div class="absolute inset-x-0 bottom-0 z-[5] h-16 {testClasses}">
		<slot name="bottom-navigation" />
	</div>
</home>
