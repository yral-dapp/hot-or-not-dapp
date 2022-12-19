<script lang="ts">
import Avatar from '$components/avatar/Avatar.svelte';
import IconButton from '$components/button/IconButton.svelte';
import EyeIcon from '$components/icons/EyeIcon.svelte';
import FireIcon from '$components/icons/FireIcon.svelte';
import HeartIcon from '$components/icons/HeartIcon.svelte';
import ShareMessageIcon from '$components/icons/ShareMessageIcon.svelte';
import LoadingIcon from '$components/icons/LoadingIcon.svelte';
import { playerState } from '$stores/playerState';
import SoundIcon from '$components/icons/SoundIcon.svelte';
import { authState } from '$stores/auth';
import type { IndividualUserActor } from '$lib/helpers/backend';
import getDefaultImageUrl from '$lib/utils/getDefaultImageUrl';
import Log from '$lib/utils/Log';
import { generateRandomName } from '$lib/utils/randomUsername';
import type { Principal } from '@dfinity/principal';
import { createEventDispatcher, onMount } from 'svelte';
import userProfile from '$stores/userProfile';
import { registerEvent } from '$components/seo/GoogleAnalytics.svelte';
import { debounce } from 'throttle-debounce';
import Hls from 'hls.js';
import PlayIcon from '$components/icons/PlayIcon.svelte';
import { videoHasAudio } from '$lib/utils/video';
import NoSoundIcon from '$components/icons/NoSoundIcon.svelte';

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
export let enrolledInHotOrNot = false;
export let isiPhone: boolean;

const dispatch = createEventDispatcher<{
	watchedPercentage: number;
	loaded: void;
}>();

let videoEl: HTMLVideoElement;
let currentTime = 0;
let duration = 0;
let loaded = false;
let hls: Hls;
let hasAudio = true;

export const stop = debounce(
	1000,
	() => {
		try {
			if (videoEl) {
				videoEl.muted = true;
				videoEl.currentTime = 0.05;
				videoEl.pause();
			}
		} catch (e: any) {
			Log({ error: e, i, src, inView, source: '2 play' }, 'error');
		}
	},
	{ atBegin: true }
);

export const play = debounce(
	1000,
	() => {
		if (videoEl?.paused) {
			hasAudio = videoHasAudio(videoEl);

			if (isiPhone) {
				console.log('yes to iphone');
				videoEl.volume = 0;
			} else {
				videoEl.muted = $playerState.muted;
			}
			videoEl.play().catch((e) => {
				console.log('Autoplay failed', i);
			});
		}
	},
	{ atBegin: true }
);

async function handleClick() {
	try {
		if (videoEl) {
			if (!$playerState.initialized) {
				$playerState.initialized = true;
			}
			if (videoEl.paused) {
				videoEl.play().catch((e) => {
					console.log('Click play failed', e);
				});
				$playerState.muted = false;
				videoEl.muted = false;
			} else {
				$playerState.muted = !$playerState.muted;
				videoEl.muted = $playerState.muted;
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

$: if (inView && !videoEl?.paused) {
	dispatch('watchedPercentage', (currentTime / duration) * 100);
}

$: if (inView && loaded) {
	dispatch('loaded');
}

$: if (inView) {
	play();
}

$: if (!inView) {
	stop();
}

onMount(() => {
	if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
		videoEl.src = src + '#t=0.1';
	} else if (Hls.isSupported()) {
		hls = new Hls();
		hls.loadSource(src);
		hls.attachMedia(videoEl);
		return () => {
			hls.destroy();
		};
	} else {
		Log({ error: 'Hls not supported', i, src, source: '1 videoPlayer' }, 'error');
	}
});
</script>

<player
	i="{i}"
	class="w-full block h-full items-center justify-center overflow-auto transition-all duration-500">
	<!-- svelte-ignore a11y-media-has-caption -->
	<video
		on:click="{handleClick}"
		on:loadeddata="{() => (loaded = true)}"
		bind:this="{videoEl}"
		loop
		muted="{$playerState.muted}"
		disablepictureinpicture
		disableremoteplayback
		playsinline
		preload="auto"
		poster="{thumbnail}"
		class="object-fit absolute z-[3] h-full w-full"></video>
	<img
		alt="background"
		class="absolute inset-0 z-[1] h-full w-full origin-center object-cover blur-xl"
		src="{thumbnail}" />

	{#if $playerState.muted || !$playerState.initialized}
		<div class="fade-in max-w-16 pointer-events-none absolute inset-0 z-[5]">
			<div class="flex h-full items-center justify-center">
				{#if !$playerState.initialized}
					<PlayIcon class="breathe h-16 w-16 text-white/90 drop-shadow-lg" />
				{:else}
					<SoundIcon class="breathe h-16 w-16 text-white/90 drop-shadow-lg" />
				{/if}
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
				{#if !loaded}
					<LoadingIcon class="h-8 w-8 animate-spin-slow text-white" />
				{/if}
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
			class="absolute bottom-20 flex flex-col space-y-2 left-4 z-[9] pr-20">
			{#if !hasAudio}
				<div
					class="flex w-fit space-x-1 text-white/80 items-center text-xs bg-black/50 rounded-full p-1 px-2">
					<NoSoundIcon class="w-3 h-3" />
					<span class="">Video has no audio </span>
				</div>
			{/if}
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
