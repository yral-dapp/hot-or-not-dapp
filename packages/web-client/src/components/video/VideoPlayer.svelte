<script lang="ts">
import Avatar from '$components/avatar/Avatar.svelte';
import IconButton from '$components/button/IconButton.svelte';
import EyeIcon from '$components/icons/EyeIcon.svelte';
import FireIcon from '$components/icons/FireIcon.svelte';
import HeartIcon from '$components/icons/HeartIcon.svelte';
import PlayIcon from '$components/icons/PlayIcon.svelte';
import ShareIcon from '$components/icons/ShareIcon.svelte';
import SoundIcon from '$components/icons/SoundIcon.svelte';

import { tick } from 'svelte';
import { fade } from 'svelte/transition';
import { playerInitialized } from '$stores/playerInitialization';

export let src = '';
export let thumbnail = '';
export let load = false;
export let paused = false;
export let avatarPhotoUrl =
	'https://images.pexels.com/photos/3276046/pexels-photo-3276046.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';
export let userName = 'Natasha';
export let videoViews = 254000;

let isLoaded = false;
let generatedThumbnail = '';
let loadThumbnail = false;
let showPausedButton = false;

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

$: console.log({ src, paused, $playerInitialized });
</script>

<div
	on:click="{() => $playerInitialized && (paused = !paused)}"
	class="relative flex h-full w-auto snap-center items-center justify-center"
>
	{#if load}
		<video
			loop
			muted="{!$playerInitialized}"
			autoplay
			on:pause="{() => (showPausedButton = true)}"
			on:play="{() => (showPausedButton = false)}"
			bind:paused
			src="{src}"
			class="object-fit absolute z-[3] h-full w-full"
			on:loadedmetadata="{(e) => setTimeout(() => generateThumbnail(e.target), 200)}"></video>

		<video
			loop
			muted
			autoplay
			bind:paused
			class="absolute inset-0 z-[1] h-full w-full origin-center object-cover blur-md"
			src="{src}"></video>
	{:else if thumbnail || generatedThumbnail}
		<img
			transition:fade
			alt="blur"
			class="absolute inset-0 z-[1] h-full w-full origin-center object-cover blur-md"
			src="{thumbnail || generatedThumbnail}"
		/>
	{/if}

	{#if !$playerInitialized}
		<div
			transition:fade="{{ duration: 100 }}"
			class="max-w-16 pointer-events-none absolute inset-0 z-[5]"
		>
			<div class="flex h-full items-center justify-center">
				<IconButton>
					<SoundIcon class="breathe h-16 w-16 text-white/90 drop-shadow-lg" />
				</IconButton>
			</div>
		</div>
	{:else if load && showPausedButton}
		<div
			transition:fade="{{ duration: 100 }}"
			class="max-w-16 pointer-events-none absolute inset-0 z-[5]"
		>
			<div class="flex h-full items-center justify-center">
				<IconButton>
					<PlayIcon class="h-32 w-32 text-white/90 drop-shadow-lg" />
				</IconButton>
			</div>
		</div>
	{/if}

	<div class="max-w-16 absolute right-4 bottom-20 z-[5]">
		<div class="flex flex-col space-y-6">
			<IconButton>
				<HeartIcon class="h-8 w-8" />
			</IconButton>
			<IconButton>
				<ShareIcon class="h-6 w-6" />
			</IconButton>
			<IconButton
				class="rounded-full border-[0.15rem] border-[#FA9301] bg-gradient-to-b from-[#F63700] to-[#FFC848] p-2"
			>
				<FireIcon class="h-5 w-5" />
			</IconButton>
		</div>
	</div>

	<div class="absolute inset-x-0 bottom-20 left-4 right-16 z-[5] w-min">
		<div class="pointer-events-auto flex space-x-3">
			<Avatar class="h-12 w-12" src="{avatarPhotoUrl}" />
			<div class="flex flex-col space-y-1">
				<span>{userName}</span>
				<div class="flex items-center space-x-1">
					<EyeIcon class="h-4 w-4 text-white" />
					<span class="text-sm">{videoViews}</span>
				</div>
			</div>
		</div>
	</div>
</div>
