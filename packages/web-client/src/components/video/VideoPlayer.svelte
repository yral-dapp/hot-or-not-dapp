<script lang="ts">
import Avatar from '$components/avatar/Avatar.svelte';
import IconButton from '$components/button/IconButton.svelte';
import EyeIcon from '$components/icons/EyeIcon.svelte';
import FireIcon from '$components/icons/FireIcon.svelte';
import HeartIcon from '$components/icons/HeartIcon.svelte';
import ShareMessageIcon from '$components/icons/ShareMessageIcon.svelte';
import { fade } from 'svelte/transition';
import LoadingIcon from '$components/icons/LoadingIcon.svelte';
import placeholderImage from '$assets/placeholder.png';
import { isiPhone } from '$lib/isSafari';
import c from 'clsx';
import { playerState } from '$stores/playerState';
import SoundIcon from '$components/icons/SoundIcon.svelte';

export let src = '';
export let i: number;
export let thumbnail = '';
export let inView = false;
export let userName = 'Natasha';
export let videoViews = 254000;
export let swiperJs;

let videoEl: HTMLVideoElement;
let videoBgEl: HTMLVideoElement;
let loaded = false;
let paused = true;

let playPromise: Promise<void> | undefined = undefined;

export async function play() {
	try {
		if (videoEl) {
			videoEl.currentTime = 0.1;
			videoBgEl.currentTime = 0.1;
			playPromise = videoEl.play();
			await playPromise;
			await videoBgEl.play();
			if (!isiPhone() && $playerState.initialized && !$playerState.muted) {
				videoEl.muted = $playerState.muted = false;
			}
		}
	} catch (e) {
		if (videoEl) {
			$playerState.muted = true;
			videoEl.muted = true;
		}
	}
}

export async function stop() {
	if (videoEl && videoBgEl) {
		videoEl.currentTime = 0.1;
		videoBgEl.currentTime = 0.1;
		if (playPromise) {
			await playPromise;
		}
		videoEl.pause();
		videoBgEl.pause();
	}
}

async function handleClick() {
	if (videoEl) {
		if (paused) {
			play();
		} else {
			videoEl.muted = !videoEl.muted;
			$playerState.muted = videoEl.muted;
		}
	}
}
</script>

<player
	i="{i}"
	on:click="{handleClick}"
	class="{c(
		'inline-flex h-full items-center justify-center transition-all duration-500',
		loaded ? 'opacity-100' : 'opacity-0',
		swiperJs ? 'w-full' : 'min-h-full w-auto snap-center snap-always'
	)}"
>
	<!-- svelte-ignore a11y-media-has-caption -->
	<video
		bind:this="{videoEl}"
		loop
		playsinline
		on:loadeddata="{() => (loaded = true)}"
		autoplay
		muted
		bind:paused
		disableremoteplayback
		x-webkit-airplay="deny"
		preload="metadata"
		src="{src}"
		poster="{thumbnail}"
		class="object-fit absolute z-[3] h-full w-full"></video>
	<!-- svelte-ignore a11y-media-has-caption -->
	<video
		bind:this="{videoBgEl}"
		loop
		playsinline
		disableremoteplayback
		muted
		bind:paused
		autoplay
		preload="metadata"
		x-webkit-airplay="deny"
		class="absolute inset-0 z-[1] h-full w-full origin-center object-cover blur-xl"
		src="{src}"
	>
	</video>
	{#if (videoEl?.muted || $playerState.muted) && !paused && inView}
		<div
			in:fade="{{ duration: 100, delay: 200 }}"
			out:fade="{{ duration: 100 }}"
			class="max-w-16 pointer-events-none absolute inset-0 z-[5]"
		>
			<div class="flex h-full items-center justify-center">
				<IconButton>
					<SoundIcon class="breathe h-16 w-16 text-white/90 drop-shadow-lg" />
				</IconButton>
			</div>
		</div>
	{/if}

	<div class="max-w-16 absolute right-4 bottom-20 z-[10]">
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

	<div class="absolute inset-x-0 bottom-20 left-4 right-16 z-[10] w-min">
		<div
			on:click="{(e) => e.stopImmediatePropagation()}"
			class="pointer-events-auto flex space-x-3"
		>
			<a href="/profile/2" sveltekit:prefetch class="h-12 w-12">
				<Avatar class="h-12 w-12" src="{placeholderImage}" />
			</a>
			<div class="flex flex-col space-y-1">
				<a href="/profile/2" sveltekit:prefetch>{userName}</a>
				<div class="flex items-center space-x-1">
					<EyeIcon class="h-4 w-4 text-white" />
					<span class="text-sm">{videoViews}</span>
				</div>
			</div>
		</div>
	</div>
</player>

{#if !loaded}
	<loader
		transition:fade|local="{{ duration: 300 }}"
		class="max-w-16 pointer-events-none absolute inset-0 z-[5] flex items-center justify-center"
	>
		<LoadingIcon class="h-36 w-36 animate-spin-slow text-primary" />
	</loader>
{/if}

<style>
@supports (-webkit-overflow-scrolling: touch) {
	* {
		transform: translate3d(0, 0, 0);
	}
}
</style>
