<script lang="ts">
import NoVideosIcon from '$components/icons/NoVideosIcon.svelte';
import ShakaPlayer from '$components/video/ShakaPlayer.svelte';
import { getTopPosts, getWatchedVideosFromCache, type PostPopulated } from '$lib/helpers/feed';
import { getDashUrl, getHlsUrl, getThumbnailUrl } from '$lib/utils/cloudflare';
import Log from '$lib/utils/Log';
import { handleParams } from '$lib/utils/params';
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
let shaka: any;
let currentVideoIndex = 0;
let noMoreVideos = false;
let loading = false;
let currentPlayingIndex = 0;
let videoPlayers: ShakaPlayer[] = [];
let fetchedVideosCount = 0;

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
		videoPlayers[currentPlayingIndex]?.stop();
		videoPlayers[index]?.play();
		videoPlayers[index + 1]?.stop();
		currentPlayingIndex = index;
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
	//@ts-ignore
	shaka = await import('shaka-player/dist/shaka-player.compiled.js');
	await shaka.polyfill.installAll();
	console.log('is shaka supported', shaka.Player.isBrowserSupported());
	updateURL();
	$playerState.initialized = false;
	$playerState.muted = true;
	if (data.post) {
		videos = [data.post, ...videos];
	}
	await tick();
	await fetchNextVideos();
	handleParams();
});
</script>

<Swiper
	direction="{'vertical'}"
	observer
	slidesPerView="{1}"
	on:slideChange="{handleChange}"
	cssMode
	spaceBetween="{100}"
	class="h-full w-full">
	{#each videos as video, i (i)}
		<SwiperSlide class="flex h-full w-full snap-always items-center justify-center">
			{#if currentVideoIndex - keepVideosLoadedCount < i && currentVideoIndex + keepVideosLoadedCount > i}
				<ShakaPlayer
					shaka="{shaka}"
					srcHls="{getHlsUrl(video.video_uid)}"
					srcDash="{getDashUrl(video.video_uid)}"
					thumbnail="{getThumbnailUrl(video.video_uid)}"
					inView="{i == currentVideoIndex}"
					i="{i}"
					bind:this="{videoPlayers[i]}" />
			{/if}
		</SwiperSlide>
	{/each}
	{#if loading}
		<SwiperSlide class="flex h-full w-full items-center justify-center">
			<div class="relative flex h-full w-full flex-col items-center justify-center space-y-8 px-8">
				<div class="text-center text-lg font-bold">Loading</div>
			</div>
		</SwiperSlide>
	{/if}
	{#if noMoreVideos}
		<SwiperSlide class="flex h-full w-full items-center justify-center">
			<div class="relative flex h-full w-full flex-col items-center justify-center space-y-8 px-8">
				<NoVideosIcon class="w-56" />
				<div class="text-center text-lg font-bold">No more videos to display today</div>
			</div>
		</SwiperSlide>
	{/if}
</Swiper>
