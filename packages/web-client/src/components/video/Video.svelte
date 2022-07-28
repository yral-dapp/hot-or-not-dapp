<script lang="ts">
import { tick } from 'svelte';
import { fade } from 'svelte/transition';

export let src = '';
export let thumbnail = '';
export let load = false;
export let paused: boolean = true;

let isLoaded = false;
let generatedThumbnail = '';
let loadThumbnail = false;

async function generateThumbnail(target: EventTarget | null) {
	if (loadThumbnail && target && !isLoaded) {
		const videoEl = target as HTMLVideoElement;
		isLoaded = true;
		await tick();
		const canvas = document.createElement('canvas');
		const context = canvas.getContext('2d');
		canvas.height = videoEl.videoHeight / 6;
		canvas.width = videoEl.videoWidth / 6;
		if (context) {
			context.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
			generatedThumbnail = canvas.toDataURL();
			console.log({ generatedThumbnail });
		}
	}
}

$: console.log('thumbnail', generatedThumbnail);
</script>

<div
	on:click="{() => (paused = !paused)}"
	class="relative flex h-full w-auto snap-center items-center justify-center"
>
	{#if load}
		<!-- svelte-ignore a11y-media-has-caption -->
		<video
			loop
			autoplay
			on:loadedmetadata="{(e) => setTimeout(() => generateThumbnail(e.target), 200)}"
			class="object-fit z-[3] h-full w-full"
			bind:paused
			src="{src}"></video>
	{/if}

	{#if load}
		<!-- svelte-ignore a11y-media-has-caption -->
		<video
			class="absolute inset-0 z-[1] h-full w-full origin-center object-cover blur-lg"
			bind:paused
			autoplay
			loop
			src="{src}"
		>
		</video>
	{:else if thumbnail || generatedThumbnail}
		<img
			transition:fade
			alt="blur"
			class="absolute inset-0 z-[1] h-full w-full origin-center object-cover blur-lg"
			src="{thumbnail || generatedThumbnail}"
		/>
	{/if}
</div>
