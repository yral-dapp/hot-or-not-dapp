<script lang="ts">
import Avatar from '$components/avatar/Avatar.svelte';
import IconButton from '$components/button/IconButton.svelte';
import EyeIcon from '$components/icons/EyeIcon.svelte';
import GiftBoxIcon from '$components/icons/GiftBoxIcon.svelte';
import LoadingIcon from '$components/icons/LoadingIcon.svelte';
import PieChartIcon from '$components/icons/PieChartIcon.svelte';
import ShareMessageIcon from '$components/icons/ShareMessageIcon.svelte';
import SoundIcon from '$components/icons/SoundIcon.svelte';
import TimerIcon from '$components/icons/TimerIcon.svelte';
import UsersIcon from '$components/icons/UsersIcon.svelte';
import HotOrNot from '$components/navigation/HotOrNot.svelte';
import type { IndividualUserCanister } from '$lib/helpers/backend';
import getDefaultImageUrl from '$lib/utils/getDefaultImageUrl';
import { isiPhone } from '$lib/utils/isSafari';
import Log from '$lib/utils/Log';
import { generateRandomName } from '$lib/utils/randomUsername';
import { authStore } from '$stores/auth';
import { playerState } from '$stores/playerState';
import c from 'clsx';
import { fade } from 'svelte/transition';

export let src = '';
export let id: bigint = BigInt('');
export let i: number;
export let thumbnail = '';
export let inView = false;
export let userName = '';
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
		Log({ error: e, hnn: true, i, src, inView, source: '1 play' }, 'error');
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
	try {
		if (videoEl) {
			if (paused) {
				play();
			} else {
				videoEl.muted = !videoEl.muted;
				$playerState.muted = videoEl.muted;
			}
		}
	} catch (e) {
		Log({ error: e, hnn: true, i, src, inView, source: '1 handleClick' }, 'error');
	}
}

async function handleLike() {
	if ($authStore.isLoggedIn) {
		liked = !liked;
		individualUser().update_post_toggle_like_status_by_caller(id);
	} else $authStore.showLogin = true;
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
	)}">
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
		src="{src}">
	</video>
	{#if (videoEl?.muted || $playerState.muted) && !paused && inView}
		<div
			in:fade|local="{{ duration: 100, delay: 200 }}"
			out:fade|local="{{ duration: 100 }}"
			class="max-w-16 pointer-events-none absolute inset-0 z-[5]">
			<div class="flex h-full items-center justify-center">
				<IconButton>
					<SoundIcon class="breathe h-16 w-16 text-white/90 drop-shadow-lg" />
				</IconButton>
			</div>
		</div>
	{/if}

	<div
		style="-webkit-transform: translate3d(0, 0, 0);"
		transition:fade|local
		class="absolute z-[10] block h-full w-full">
		<div
			style="-webkit-transform: translate3d(0, 0, 0);"
			class="absolute bottom-40 z-[10] flex w-full space-x-2 px-4">
			<div class="flex grow flex-col space-y-4">
				<div
					on:click="{(e) => e.stopImmediatePropagation()}"
					class="pointer-events-auto flex space-x-3">
					<a href="/profile/{i}" data-sveltekit-prefetch class="h-12 w-12">
						<Avatar class="h-12 w-12 shrink-0" src="{getDefaultImageUrl(i.toString())}" />
					</a>
					<div class="flex flex-col space-y-1">
						<a href="/profile/{i}" data-sveltekit-prefetch>
							@{userName != '' ? userName : generateRandomName('username', i.toString())}
						</a>
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
					class="pointer-events-auto w-80 text-left">
					A few weeks ago I was scrolling down on hot or not and I found this very fun choreography
					by @jorgeandindira. I thought it would be a nice challenge since I've never animated a
					character dancing before. I hope you like the results.
				</button>
				<div class="pointer-events-none flex items-start space-x-2">
					<div
						class="flex flex-nowrap items-center space-x-1 rounded-full bg-black/50 py-2 px-4 text-sm">
						<TimerIcon class="h-4 w-4" />
						<span class="shrink-0">50m 55s</span>
					</div>
					<div
						class="flex flex-nowrap items-center space-x-1 rounded-full bg-black/50 py-2 px-4 text-sm">
						<UsersIcon class="h-5 w-5" />
						<span class="shrink-0">48/100</span>
					</div>
					<div
						class="flex flex-nowrap items-center space-x-1 rounded-full bg-black/50 py-2 px-4 text-sm">
						<PieChartIcon class="h-4 w-4" />
						<span class="shrink-0">50m 55s</span>
					</div>
				</div>
			</div>
			<div class="max-w-16 flex shrink-0 flex-col space-y-6">
				<IconButton
					on:click="{(e) => {
						e.stopImmediatePropagation();
					}}">
					<GiftBoxIcon class="h-8 w-8" />
				</IconButton>
				<IconButton
					on:click="{(e) => {
						e.stopImmediatePropagation();
						handleShare();
					}}">
					<ShareMessageIcon class="h-6 w-6" />
				</IconButton>
			</div>
		</div>
		<div
			style="-webkit-transform: translate3d(0, 0, 0);"
			class="pointer-events-none absolute inset-x-0 bottom-0 z-[5] max-h-48">
			<HotOrNot />
		</div>
		<div
			style="background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.8) 100%);"
			class="pointer-events-none absolute inset-x-0 bottom-0 z-[4] h-full">
		</div>
	</div>
</player>

{#if !loaded}
	<loader
		transition:fade|local="{{ duration: 300 }}"
		class="max-w-16 pointer-events-none absolute inset-0 z-[5] flex items-center justify-center">
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
