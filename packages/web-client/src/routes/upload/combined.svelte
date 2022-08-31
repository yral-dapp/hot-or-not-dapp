<script lang="ts">
let src = '';
let paused = true;
function checkFileSelected(files: FileList | null) {
	if (files && files[0]) {
		src = URL.createObjectURL(files[0]) + '#t=0.1';
	}
}
</script>

<input
	type="file"
	accept="video/*"
	class="border-2 p-4"
	on:change="{(e) => checkFileSelected(e.currentTarget.files)}"
/>

{#if src}
	<!-- svelte-ignore a11y-media-has-caption -->
	<video
		preload="metadata"
		on:click="{() => (paused = !paused)}"
		bind:paused
		src="{src}"
		playsinline
		muted
		class="h-80 w-full rounded-xl"
	>
	</video>
{/if}
