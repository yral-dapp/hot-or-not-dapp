<script lang="ts">
import { tick } from 'svelte';
import { fade } from 'svelte/transition';

export let src = '';
export let load = false;
export let paused: boolean = true;
export let canvasEl: HTMLCanvasElement;

let isLoaded = false;
let dataUrl = '';

async function generateThumbnail(target: EventTarget | null) {
	if (false && target && !isLoaded) {
		const videoEl = target as HTMLVideoElement;
		isLoaded = true;
		await tick();
		const canvas = document.createElement('canvas');
		const context = canvas.getContext('2d');
		canvas.height = videoEl.videoHeight / 6;
		canvas.width = videoEl.videoWidth / 6;
		if (context) {
			context.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
			dataUrl = canvas.toDataURL();
			console.log({ dataUrl });
		}
	}
}
</script>

<div class="relative flex h-full w-auto snap-center items-center justify-center">
	{#if load}
		<!-- svelte-ignore a11y-media-has-caption -->
		<video
			on:loadedmetadata="{(e) => setTimeout(() => generateThumbnail(e.target), 200)}"
			class="object-fit z-[3] h-full w-full"
			bind:paused
			src="{src}"></video>
	{/if}

	{#if isLoaded}
		<overlay
			on:click="{() => (paused = !paused)}"
			transition:fade
			class="absolute top-0 z-[4] h-full w-full border-2 border-red-500 text-red-500"
		>
		</overlay>
	{/if}
	{#if dataUrl}
		<!-- svelte-ignore a11y-media-has-caption -->
		<img
			transition:fade
			alt="blur"
			class="absolute inset-0 z-[1] h-full w-full origin-center object-cover blur-lg"
			src="{dataUrl}"
		/>
	{/if}
</div>
