<script lang="ts">
import Avatar from '$components/avatar/Avatar.svelte';
import IconButton from '$components/button/IconButton.svelte';
import EyeIcon from '$components/icons/EyeIcon.svelte';
import GiftBoxIcon from '$components/icons/GiftBoxIcon.svelte';
import LoadingIcon from '$components/icons/LoadingIcon.svelte';
import ShareMessageIcon from '$components/icons/ShareMessageIcon.svelte';
import SoundIcon from '$components/icons/SoundIcon.svelte';
import type { IndividualUserCanister } from '$lib/backend';
import getDefaultImageUrl from '$lib/getDefaultImageUrl';
import { isiPhone } from '$lib/isSafari';
import { auth } from '$stores/auth';
import { playerState } from '$stores/playerState';
import c from 'clsx';
import { fade } from 'svelte/transition';

export let src = '';
export let id: bigint = BigInt('');
export let i: number;
export let thumbnail = '';
export let inView = false;
export let userName = 'Natasha';
export let videoViews = 254000;
export let swiperJs;
export let liked = false;
export let shareCount = 0;
export let shared = false;
export let individualUser: () => IndividualUserCanister;

let videoEl: HTMLVideoElement;
let videoBgEl: HTMLVideoElement;
let loaded = false;
let paused = true;
let truncate = true;

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

async function handleLike() {
	if ($auth.isLoggedIn) {
		liked = !liked;
		individualUser().update_post_toggle_like_status_by_caller(id);
	} else $auth.showLogin = true;
}

async function handleShare() {
	if (!shared) {
		shareCount++;
		shared = true;
		individualUser().update_post_increment_share_count(id);
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
			in:fade|local="{{ duration: 100, delay: 200 }}"
			out:fade|local="{{ duration: 100 }}"
			class="max-w-16 pointer-events-none absolute inset-0 z-[5]"
		>
			<div class="flex h-full items-center justify-center">
				<IconButton>
					<SoundIcon class="breathe h-16 w-16 text-white/90 drop-shadow-lg" />
				</IconButton>
			</div>
		</div>
	{/if}

	<div class="max-w-16 absolute right-4 bottom-40 z-[10]">
		<div class="flex flex-col space-y-6">
			<IconButton
				on:click="{(e) => {
					e.stopImmediatePropagation();
				}}"
			>
				<GiftBoxIcon class="h-8 w-8" />
			</IconButton>
			<IconButton
				on:click="{(e) => {
					e.stopImmediatePropagation();
					handleShare();
				}}"
			>
				<ShareMessageIcon class="h-6 w-6" />
			</IconButton>
		</div>
	</div>

	<div class="pointer-events-none absolute bottom-40 left-4 z-[9] flex flex-col space-y-4 pr-20">
		<div
			on:click="{(e) => e.stopImmediatePropagation()}"
			class="pointer-events-auto flex space-x-3"
		>
			<a href="/profile/2" sveltekit:prefetch class="h-12 w-12">
				<Avatar class="h-12 w-12 shrink-0" src="{getDefaultImageUrl(i.toString())}" />
			</a>
			<div class="flex flex-col space-y-1">
				<a href="{`/profile/{i + 1}`}" sveltekit:prefetch>{userName}</a>
				<div class="flex items-center space-x-1">
					<EyeIcon class="h-4 w-4 text-white" />
					<span class="text-sm">{videoViews}</span>
				</div>
			</div>
		</div>
		<button
			class:truncate
			on:click="{(e) => {
				e.stopImmediatePropagation();
				truncate = !truncate;
			}}"
			class="pointer-events-auto w-80 text-left"
		>
			Lorem ipsum dolor sit amet, consect etur orem ipsum dolor sit amet, consect etur
		</button>
		<div class="pointer-events-none flex items-start space-x-2">
			<div class="rounded-full bg-black/50 py-1 px-4 text-sm">Tag</div>
			<div class="rounded-full bg-black/50 py-1 px-4 text-sm">Tag</div>
			<div class="rounded-full bg-black/50 py-1 px-4 text-sm">Tag</div>
		</div>
	</div>
	<div
		style="background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.8) 100%);"
		class="pointer-events-none absolute inset-x-0 bottom-0 z-[4] h-full"
	></div>
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
