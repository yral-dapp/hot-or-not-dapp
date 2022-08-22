<script lang="ts">
import Avatar from '$components/avatar/Avatar.svelte';
import IconButton from '$components/button/IconButton.svelte';
import EyeIcon from '$components/icons/EyeIcon.svelte';
import FireIcon from '$components/icons/FireIcon.svelte';
import HeartIcon from '$components/icons/HeartIcon.svelte';
import ShareMessageIcon from '$components/icons/ShareMessageIcon.svelte';
import { tick } from 'svelte';
import { fade } from 'svelte/transition';
import { playerState } from '$stores/playerState';
import SoundIcon from '$components/icons/SoundIcon.svelte';

export let paused = true;
export let src = '';
export let thumbnail = '';
export let load = false;
export let avatarPhotoUrl =
	'https://images.pexels.com/photos/3276046/pexels-photo-3276046.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';
export let userName = 'Natasha';
export let videoViews = 254000;

let isLoaded = false;
let generatedThumbnail = '';
let loadThumbnail = false;
let videoEl: HTMLVideoElement;
let videoEl2: HTMLVideoElement;
let muted = true;

$: if (videoEl && videoEl2 && !paused) {
	videoEl.play();
	videoEl2.play();
	muted = false;
} else if (videoEl && videoEl2) {
	videoEl.currentTime = 0;
	videoEl.pause();
	videoEl2.currentTime = 0;
	videoEl2.pause();
	muted = true;
}

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
</script>

<div
	on:click="{() => ($playerState.muted = !$playerState.muted)}"
	class="relative flex h-full w-auto snap-center snap-always items-center justify-center"
>
	{#if load}
		<!-- svelte-ignore a11y-media-has-caption -->
		<video
			bind:this="{videoEl}"
			loop
			playsinline
			muted="{$playerState.muted || muted}"
			disableremoteplayback
			x-webkit-airplay="deny"
			autoplay
			preload="metadata"
			src="{src}"
			poster="{thumbnail}"
			class="object-fit absolute z-[3] h-full w-full"
			on:loadedmetadata="{(e) => setTimeout(() => generateThumbnail(e.target), 200)}"></video>
		<!-- svelte-ignore a11y-media-has-caption -->
		<video
			bind:this="{videoEl2}"
			loop
			autoplay
			playsinline
			muted
			preload="metadata"
			x-webkit-airplay="deny"
			class="absolute inset-0 z-[1] h-full w-full origin-center object-cover blur-md"
			src="{src}"
		>
		</video>
	{/if}

	{#if $playerState.muted}
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
	{/if}

	<div class="max-w-16 absolute right-4 bottom-20 z-[5]">
		<div class="flex flex-col space-y-6">
			<IconButton>
				<HeartIcon class="h-8 w-8" />
			</IconButton>
			<IconButton>
				<ShareMessageIcon class="h-6 w-6" />
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
