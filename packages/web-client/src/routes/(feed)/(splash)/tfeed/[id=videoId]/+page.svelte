<script lang="ts">
import IconButton from '$components/button/IconButton.svelte';
import NoVideosIcon from '$components/icons/NoVideosIcon.svelte';
import SoundIcon from '$components/icons/SoundIcon.svelte';
import TVideoPlayer from '$components/video/TVideoPlayer.svelte';
import { getTopPosts, getWatchedVideosFromCache, type PostPopulated } from '$lib/helpers/feed';
import { getHlsUrl, getThumbnailUrl } from '$lib/utils/cloudflare';
import Log from '$lib/utils/Log';
import { playerState } from '$stores/playerState';
import { onMount, tick } from 'svelte';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/svelte';
import { debounce } from 'throttle-debounce';
import type { PageData } from './$types';

export let data: PageData;

const fetchCount = 50;
const fetchWhenVideosLeft = 10;
const keepVideosLoadedCount: number = 4;

let videos: PostPopulated[] = [];
let currentVideoIndex = 0;
let noMoreVideos = false;
let loading = false;
let currentPlayingIndex = 0;
let fetchedVideosCount = 0;

let videoEl: HTMLVideoElement;

async function fetchNextVideos() {
	// console.log(`to fetch: ${!noMoreVideos} && ${videos.length}-${currentVideoIndex}<${fetchCount}`);
	if (!noMoreVideos && videos.length - currentVideoIndex < fetchWhenVideosLeft) {
		try {
			Log({ res: 'fetching from ' + fetchedVideosCount, source: '0 fetchNextVideos' }, 'info');
			loading = true;
			const res = await getTopPosts(fetchedVideosCount, fetchCount, true);
			if (res.error) {
				// TODO: Handle error
				loading = false;
				return;
			}

			fetchedVideosCount = res.from;

			videos = [...videos, ...res.posts];

			if (!res.noMorePosts && res.posts.length == 0) {
				fetchNextVideos();
			} else if (res.noMorePosts) {
				const watchedVideos = await getWatchedVideosFromCache();
				videos = [...videos, ...watchedVideos];
			}

			noMoreVideos = res.noMorePosts;
			await tick();
			loading = false;

			Log({ res: 'fetched', noMoreVideos, source: '0 fetchNextVideos' }, 'info');
		} catch (e) {
			Log({ error: e, noMoreVideos, source: '1 fetchNextVideos' }, 'error');
			loading = false;
		}
	}
}

async function handleChange(e: CustomEvent) {
	const index = e.detail[0].realIndex;
	currentVideoIndex = index;
	Log({ currentVideoIndex, source: '0 handleChange' }, 'info');
	playVideo(index);
	fetchNextVideos();
	updateURL(videos[currentVideoIndex]);
}

const playVideo = debounce(50, async (index: number) => {
	try {
		currentPlayingIndex = index;
		touching = false;
	} catch (e) {
		Log({ error: e, index, source: '1 playVideo' }, 'error');
	}
});

function updateURL(post?: PostPopulated) {
	if (!post) return;
	const url = post.publisher_canister_id + '@' + post.post_id;
	$playerState.currentFeedUrl = url;
	window.history.replaceState('', '', url);
}

onMount(async () => {
	updateURL();
	$playerState.initialized = false;
	$playerState.muted = true;
	if (data.post) {
		videos = [data.post, ...videos];
	}
	await tick();
	await fetchNextVideos();
});

function handleClick() {
	if (!$playerState.initialized) {
		$playerState.initialized = true;
	}
	$playerState.muted = !$playerState.muted;
	videoEl.muted = $playerState.muted;
}

let touching = false;
</script>

<svelte:head>
	<title>Home Feed | Hot or Not</title>
</svelte:head>
<div class="h-full w-full relative">
	{#if $playerState.muted}
		<div class="fade-in max-w-16 pointer-events-none absolute inset-0 z-[11]">
			<div class="flex h-full items-center justify-center">
				<IconButton ariaLabel="Unmute this video">
					<SoundIcon class="breathe h-16 w-16 text-white/90 drop-shadow-lg" />
				</IconButton>
			</div>
		</div>
	{/if}
	<video
		on:pointerdown="{() => {
			console.log('down');
			touching = true;
		}}"
		on:pointerup="{async () => {
			console.log('up');
			await tick();
			touching = false;
		}}"
		bind:this="{videoEl}"
		on:click="{handleClick}"
		class="absolute w-full h-full {touching
			? 'pointer-events-none opacity-0'
			: ''} z-[10] inset-0 border-2 border-red-500"
		autoplay
		muted></video>
	<Swiper
		direction="{'vertical'}"
		observer
		slidesPerView="{1}"
		on:slideChange="{handleChange}"
		cssMode
		spaceBetween="{100}"
		class="h-full w-full">
		{#each videos as video, i (i)}
			{@const src = getHlsUrl(video.video_uid)}
			<SwiperSlide class="flex h-full w-full snap-always items-center justify-center">
				{#if currentVideoIndex - keepVideosLoadedCount < i && currentVideoIndex + keepVideosLoadedCount > i}
					<TVideoPlayer
						on:inView="{({ detail }) => {
							console.log('inVIEW', detail.i);
							detail.hls.attachMedia(videoEl);
						}}"
						i="{i}"
						id="{video.id}"
						likeCount="{Number(video.like_count)}"
						displayName="{video.created_by_display_name[0]}"
						profileLink="{video.created_by_unique_user_name[0] ??
							video.created_by_user_principal_id}"
						liked="{video.liked_by_me}"
						description="{video.description}"
						createdById="{video.created_by_user_principal_id}"
						videoViews="{Number(video.total_view_count)}"
						publisherCanisterId="{video.publisher_canister_id}"
						userProfileSrc="{video.created_by_profile_photo_url[0]}"
						inView="{i == currentVideoIndex}"
						enrolledInHotOrNot="{video.hot_or_not_feed_ranking_score &&
							video.hot_or_not_feed_ranking_score[0] !== undefined}"
						thumbnail="{getThumbnailUrl(video.video_uid)}"
						src="{src}" />
				{/if}
			</SwiperSlide>
		{/each}
		{#if loading}
			<SwiperSlide class="flex h-full w-full items-center justify-center">
				<div
					class="relative flex h-full w-full flex-col items-center justify-center space-y-8 px-8">
					<div class="text-center text-lg font-bold">Loading</div>
				</div>
			</SwiperSlide>
		{/if}
		{#if noMoreVideos}
			<SwiperSlide class="flex h-full w-full items-center justify-center">
				<div
					class="relative flex h-full w-full flex-col items-center justify-center space-y-8 px-8">
					<NoVideosIcon class="w-56" />
					<div class="text-center text-lg font-bold">No more videos to display today</div>
				</div>
			</SwiperSlide>
		{/if}
	</Swiper>
</div>
