<script lang="ts">
import Avatar from '$components/avatar/Avatar.svelte';
import IconButton from '$components/button/IconButton.svelte';
import EyeIcon from '$components/icons/EyeIcon.svelte';
import FireIcon from '$components/icons/FireIcon.svelte';
import HeartIcon from '$components/icons/HeartIcon.svelte';
import ShareMessageIcon from '$components/icons/ShareMessageIcon.svelte';
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
import { createEventDispatcher, tick } from 'svelte';
import userProfile from '$stores/userProfile';
import { registerEvent } from '$components/seo/GoogleAnalytics.svelte';
import { onMount } from 'svelte';
import Hls from 'hls.js';

export let swiperJs: boolean;
export let src;
export let i: number;
export let id: bigint;
export let inView = false;
export let thumbnail = '';
export let displayName = '';
export let profileLink = '';
export let description = '';
export let videoViews = 254000;
export let publisherCanisterId: string;
export let userProfileSrc = '';
export let liked = false;
export let createdById = '';
export let individualUser: (principal?: Principal | string) => IndividualUserActor;
export let likeCount: number = 0;
export let nextVideo = false;
export let enrolledInHotOrNot = false;

const dispatch = createEventDispatcher<{
	watchedPercentage: number;
	loaded: void;
}>();

let videoEl: HTMLVideoElement;
let hls: Hls;
let currentTime = 0;
let duration = 0;
let loaded = false;
let paused = true;

export async function stop() {
	try {
		if (videoEl) {
			videoEl.currentTime = 0.1;
			videoEl.pause();
		}
	} catch (e: any) {
		Log({ error: e, i, src, inView, source: '2 play' }, 'error');
	}
}

export async function play() {
	if (videoEl) {
		videoEl.play();
		if (isiPhone()) return;
		videoEl.muted = $playerState.muted;
	}
}

async function handleClick() {
	try {
		if (videoEl) {
			if (!$playerState.initialized) {
				$playerState.initialized = true;
			}
			if (paused) {
				videoEl.play();
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
			video_publisher_id: profileLink,
			video_publisher_canister_id: publisherCanisterId,
			video_id: id,
			likes: likeCount
		});
		await individualUser(publisherCanisterId).update_post_toggle_like_status_by_caller(id);
	} else $authState.showLogin = true;
}

async function handleShare() {
	try {
		await navigator.share({
			title: 'Hot or Not',
			text: `Check out this hot video by ${displayName}. \n${description}`,
			url: `https://hotornot.wtf/feed/${publisherCanisterId}@${id}`
		});
	} catch (_) {}
	registerEvent('share_video', {
		userId: $userProfile.principal_id,
		video_publisher_id: profileLink,
		video_publisher_canister_id: publisherCanisterId,
		video_id: id
	});
	await individualUser(publisherCanisterId).update_post_increment_share_count(id);
}

$: if (inView && !paused) {
	dispatch('watchedPercentage', (currentTime / duration) * 100);
}

$: if (inView && loaded) {
	dispatch('loaded');
}

$: if (inView) {
	play();
} else if (!paused) {
	stop();
}

onMount(() => {
	if (Hls.isSupported()) {
		hls = new Hls();
		hls.loadSource(src);
		hls.attachMedia(videoEl);
		paused = true;
		return () => {
			hls.destroy();
		};
	} else if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
		videoEl.src = src;
	} else if (inView) {
		// setTimeout(() => {
		// 	dispatch('inView', { hls, i, src });
		// }, 50);
	}
});
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
		bind:paused="{paused}"
		bind:currentTime="{currentTime}"
		bind:duration="{duration}"
		disableremoteplayback
		x-webkit-airplay="deny"
		preload="metadata"
		poster="{thumbnail}"
		class="object-fit absolute z-[3] h-full w-full"></video>
	<img
		alt="background"
		class="absolute inset-0 z-[1] h-full w-full origin-center object-cover blur-xl"
		src="{thumbnail}" />

	{#if (videoEl?.muted || $playerState.muted) && !paused}
		<div class="fade-in max-w-16 pointer-events-none absolute inset-0 z-[5]">
			<div class="flex h-full items-center justify-center">
				<IconButton ariaLabel="Unmute this video">
					<SoundIcon class="breathe h-16 w-16 text-white/90 drop-shadow-lg" />
				</IconButton>
			</div>
		</div>
	{/if}

	<div
		style="background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 10%, rgba(0,0,0,0.8) 100%);"
		class="fade-in pointer-events-none absolute bottom-0 z-[10] block h-64 w-full">
		<div
			style="-webkit-transform: translate3d(0, 0, 0);"
			class="max-w-16 pointer-events-auto absolute right-4 bottom-20 z-[10]">
			<div class="flex flex-col space-y-6">
				<IconButton
					ariaLabel="Toggle like on this post"
					on:click="{(e) => {
						e.stopImmediatePropagation();
						handleLike();
					}}">
					<HeartIcon filled="{liked}" class="h-8 w-8" />
				</IconButton>
				<IconButton
					ariaLabel="Share this post"
					on:click="{(e) => {
						e.stopImmediatePropagation();
						handleShare();
					}}">
					<ShareMessageIcon class="h-6 w-6" />
				</IconButton>
				<IconButton
					ariaLabel="Check out this post in Hot or Not"
					disabled="{!enrolledInHotOrNot}"
					href="{`/hotornot/${publisherCanisterId}@${id}`}"
					class="rounded-full border-[0.15rem] border-[#FA9301] bg-gradient-to-b from-[#F63700] to-[#FFC848] p-2">
					<FireIcon class="h-5 w-5" />
				</IconButton>
			</div>
		</div>

		<div
			style="-webkit-transform: translate3d(0, 0, 0);"
			class="absolute bottom-20 left-4 z-[9] pr-20">
			<div class="pointer-events-auto flex space-x-3">
				<a href="/profile/{profileLink}" class="h-12 w-12 shrink-0">
					<Avatar class="h-12 w-12" src="{userProfileSrc || getDefaultImageUrl(createdById)}" />
				</a>
				<div class="flex flex-col space-y-1 capitalize">
					<a href="/profile/{profileLink}">
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
		class="max-w-16 fade-in pointer-events-none absolute inset-0 z-[5] flex items-center justify-center">
		<LoadingIcon class="h-36 w-36 animate-spin-slow text-primary" />
	</loader>
{/if}
