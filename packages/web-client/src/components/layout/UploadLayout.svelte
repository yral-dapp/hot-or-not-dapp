<script lang="ts">
export let testMode = false;

$: testClasses = testMode ? 'border-2 border-white/30' : '';
</script>

<upload-layout class="safe-bottom relative h-screen w-full overflow-hidden text-white">
	<div
		class="relative z-[2] flex h-12 w-full items-center justify-center bg-black py-8 shadow-xl shadow-black/50 {testClasses}">
		<div class="absolute left-4 top-4">
			<slot name="top-left" />
		</div>
		<slot name="top-center" />
	</div>
	<slot name="content" />
</upload-layout>
