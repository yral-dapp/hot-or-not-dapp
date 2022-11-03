<script lang="ts">
import Avatar from '$components/avatar/Avatar.svelte';
import IconButton from '$components/button/IconButton.svelte';
import EyeIcon from '$components/icons/EyeIcon.svelte';
import FireIcon from '$components/icons/FireIcon.svelte';
import HeartIcon from '$components/icons/HeartIcon.svelte';
import ShareMessageIcon from '$components/icons/ShareMessageIcon.svelte';
import { fade } from 'svelte/transition';
import LoadingIcon from '$components/icons/LoadingIcon.svelte';
import { isiPhone } from '$lib/utils/isSafari';
import c from 'clsx';
import { playerState } from '$stores/playerState';
import SoundIcon from '$components/icons/SoundIcon.svelte';
import { authState } from '$stores/auth';
import type { IndividualUserActor } from '$lib/helpers/backend';
import getDefaultImageUrl from '$lib/utils/getDefaultImageUrl';
import Log from '$lib/utils/Log';
import { generateRandomName } from '$lib/utils/randomUsername';
import type { Principal } from '@dfinity/principal';
import { createEventDispatcher } from 'svelte';
import userProfile from '$stores/userProfile';
import { registerEvent } from '$components/seo/GoogleAnalytics.svelte';

export let swiperJs: boolean;
export let src;
export let i: number;
export let id: bigint;
export let inView = false;
export let thumbnail = '';
export let displayName = '';
export let profileLink = '';
export let videoViews = 254000;
export let publisherCanisterId: string;
export let userProfileSrc = '';
export let liked = false;
export let createdById = '';
export let individualUser: (principal?: Principal | string) => IndividualUserActor;
export let likeCount: number = 0;

const dispatch = createEventDispatcher<{
	watchedPercentage: number;
	loaded: void;
}>();

let videoEl: HTMLVideoElement;
let videoBgEl: HTMLVideoElement;
let currentTime = 0;
let duration = 0;
let loaded = false;
let paused = true;
let playPromise: Promise<void> | undefined = undefined;
let tryToStop = true;

export async function play() {
	try {
		if (videoEl) {
			videoEl.currentTime = 0.1;
			videoBgEl.currentTime = 0.1;
			playPromise = videoEl.play();
			await playPromise;
			await videoBgEl.play();
			if (isiPhone()) return;
			if ($playerState.initialized && !$playerState.muted) {
				videoEl.muted = $playerState.muted = false;
			}
		}
	} catch (e: any) {
		const err = e.toString();
		const ignoreError =
			err.includes('The play() request') || err.includes('The request is not allowed');
		if (!ignoreError) {
			Log({ error: e, i, src, inView, source: '1 play' }, 'error');
		}
		if (videoEl) {
			$playerState.muted = true;
			videoEl.muted = true;
		}
	}
}

export async function stop() {
	try {
		if (videoEl && videoBgEl) {
			videoEl.currentTime = 0.1;
			videoBgEl.currentTime = 0.1;
			if (playPromise) {
				await playPromise;
			}
			videoEl.pause();
			videoBgEl.pause();
		}
	} catch (e: any) {
		if (tryToStop) {
			setTimeout(stop, 100);
			tryToStop = false;
		}
		const err = e.toString();
		const ignoreError =
			err.includes('The play() request') || err.includes('The request is not allowed');
		if (!ignoreError) {
			Log({ error: e, i, src, inView, source: '1 play' }, 'error');
		}
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
		Log({ error: e, i, src, inView, source: '1 handleClick' }, 'error');
	}
}

async function handleLike() {
	if ($authState.isLoggedIn) {
		liked = !liked;
		registerEvent('like_video', {
			userId: $userProfile.principal_id,
			'Video Publisher Id': profileLink,
			'Video Id': id,
			likes: likeCount
		});
		await individualUser(publisherCanisterId).update_post_toggle_like_status_by_caller(id);
	} else $authState.showLogin = true;
}

async function handleShare() {
	try {
		await navigator.share({
			title: 'Hot or Not',
			text: 'Video title',
			url: `https://hotornot.wtf/feed/${publisherCanisterId}@${id}`
		});
	} catch (_) {}
	registerEvent('share_video', {
		userId: $userProfile.principal_id,
		'Video Publisher Id': profileLink,
		'Video Id': id
	});
	await individualUser(publisherCanisterId).update_post_increment_share_count(id);
}

$: if (inView && !paused) {
	dispatch('watchedPercentage', (currentTime / duration) * 100);
}

$: if (inView && loaded) {
	dispatch('loaded');
}
</script>

<player
	i="{i}"
	class="{c(
		'block h-full items-center justify-center overflow-auto transition-all duration-500',
		loaded ? 'opacity-100' : 'opacity-0',
		swiperJs ? 'w-full' : 'min-h-full w-auto snap-center snap-always'
	)}">
	<!-- svelte-ignore a11y-media-has-caption -->
	<video
		on:click="{handleClick}"
		bind:this="{videoEl}"
		loop
		playsinline
		on:loadeddata="{() => (loaded = true)}"
		autoplay
		muted
		bind:paused
		bind:currentTime
		bind:duration
		disableremoteplayback
		x-webkit-airplay="deny"
		preload="metadata"
		src="{src}"
		poster="{thumbnail}"
		class="object-fit absolute z-[3] h-full w-full"></video>
	<!-- svelte-ignore a11y-media-has-caption -->
	<video
		on:click="{handleClick}"
		bind:this="{videoBgEl}"
		loop
		playsinline
		disableremoteplayback
		muted
		bind:paused
		autoplay
		poster="{thumbnail}"
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
		style="background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 10%, rgba(0,0,0,0.8) 100%);"
		transition:fade|local
		class="absolute bottom-0 z-[10] block h-64 w-full">
		<div
			style="-webkit-transform: translate3d(0, 0, 0);"
			class="max-w-16 absolute right-4 bottom-20 z-[10]">
			<div class="flex flex-col space-y-6">
				<IconButton
					on:click="{(e) => {
						e.stopImmediatePropagation();
						handleLike();
					}}">
					<HeartIcon filled="{liked}" class="h-8 w-8" />
				</IconButton>
				<IconButton
					on:click="{(e) => {
						e.stopImmediatePropagation();
						handleShare();
					}}">
					<ShareMessageIcon class="h-6 w-6" />
				</IconButton>
				<IconButton
					on:click="{(e) => {
						e.stopImmediatePropagation();
					}}"
					class="rounded-full border-[0.15rem] border-[#FA9301] bg-gradient-to-b from-[#F63700] to-[#FFC848] p-2">
					<FireIcon class="h-5 w-5" />
				</IconButton>
			</div>
		</div>

		<div
			style="-webkit-transform: translate3d(0, 0, 0);"
			class="absolute bottom-20 left-4 z-[9] pr-20">
			<div class="pointer-events-auto flex space-x-3">
				<a href="/profile/{profileLink}" data-sveltekit-prefetch class="h-12 w-12 shrink-0">
					<Avatar class="h-12 w-12" src="{userProfileSrc || getDefaultImageUrl(createdById)}" />
				</a>
				<div class="flex flex-col space-y-1 capitalize">
					<a href="/profile/{profileLink}" data-sveltekit-prefetch>
						{displayName || generateRandomName('name', createdById)}
					</a>
					<div class="flex items-center space-x-1">
						<EyeIcon class="h-4 w-4 text-white" />
						<span class="text-sm">{videoViews}</span>
					</div>
				</div>
			</div>
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
