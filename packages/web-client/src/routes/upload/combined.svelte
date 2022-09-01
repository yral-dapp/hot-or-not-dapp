<script lang="ts">
let src = '';
let paused = true;
function checkFileSelected(files: FileList | null) {
	if (files && files[0]) {
		src = URL.createObjectURL(files[0]);
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
	<div class="flex flex-col space-y-8">
		<!-- svelte-ignore a11y-media-has-caption -->
		<video
			preload="metadata"
			on:click="{() => (paused = !paused)}"
			bind:paused
			src="{src + '#t=0.1'}"
			playsinline
			muted
			class="h-80 w-full rounded-xl border-2 border-red-500"></video>
		<!-- svelte-ignore a11y-media-has-caption -->
		<video
			preload="none"
			on:click="{() => (paused = !paused)}"
			bind:paused
			src="{src}"
			playsinline
			muted
			autoplay
			class="h-80 w-full rounded-xl border-2 border-red-500"></video>
		<!-- svelte-ignore a11y-media-has-caption -->
		<video
			preload="metadata"
			on:click="{() => (paused = !paused)}"
			bind:paused
			src="{src}"
			muted
			class="h-80 w-full rounded-xl border-2 border-red-500"></video>
	</div>
{/if}
