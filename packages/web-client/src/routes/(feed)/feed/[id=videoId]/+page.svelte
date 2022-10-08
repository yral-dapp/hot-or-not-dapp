<script lang="ts">
import 'swiper/css';
import NoVideosIcon from '$components/icons/NoVideosIcon.svelte';
import type { IndividualUserActor } from '$lib/helpers/backend';
import { playerState } from '$stores/playerState';
import { onMount, tick } from 'svelte';
import { Swiper, SwiperSlide } from 'swiper/svelte';
import { debounce } from 'throttle-debounce';
import SplashScreen from '$components/layout/SplashScreen.svelte';
import Log from '$lib/utils/Log';
import VideoPlayer from '$components/video/VideoPlayer.svelte';
import {
	getTopPosts,
	getWatchedVideosFromCache,
	type PostPopulated,
	type PostPopulatedHistory
} from '$lib/helpers/feed';
import { getMp4Url, getThumbnailUrl } from '$lib/utils/cloudflare';
import type { Principal } from '@dfinity/principal';

const fetchCount = 5;
const keepVideosLoadedCount: number = 4;

let videos: PostPopulated[] = [];
let currentVideoIndex = 0;
let noMoreVideos = true;
let loading = false;
let currentPlayingIndex = 0;
let videoPlayers: VideoPlayer[] = [];
let individualUser: (principal?: Principal) => IndividualUserActor;
let fetchedVideosCount = 0;

type VideoViewReport = {
	progress: number;
	videoId: bigint;
	canisterId: Principal;
	count: number;
};
let videoStats: Record<number, VideoViewReport> = {};

async function fetchNextVideos() {
	// console.log('to fetch', videos.length, '-', currentVideoIndex, '<', fetchCount);
	if (!noMoreVideos && videos.length - currentVideoIndex < fetchCount) {
		try {
			Log({ res: 'fetching from ' + videos.length, source: '0 fetchNextVideos' }, 'info');

			loading = true;
			const res = await getTopPosts(fetchedVideosCount);
			if (res.error) {
				//TODO: Handle error
				loading = false;
				return;
			}

			noMoreVideos = res.noMorePosts;
			fetchedVideosCount = res.from;
			videos.push(...res.posts);
			videos = videos;

			await tick();
			loading = false;

			if (noMoreVideos) {
				const watchedVideos = await getWatchedVideosFromCache();
				videos.push(...watchedVideos);
				videos = videos;
			}

			Log({ res: 'fetched', noMoreVideos, source: '0 fetchNextVideos' }, 'info');
		} catch (e) {
			Log({ error: e, noMoreVideos, source: '1 fetchNextVideos' }, 'error');
			loading = false;
		}
	}
}

async function updateStats(oldIndex) {
	const stats = videoStats[oldIndex] as VideoViewReport | undefined;
	if (!stats || (stats?.count === 0 && stats?.progress === 0)) {
		return;
	}
	delete videoStats[oldIndex];
	const payload =
		stats.count == 0
			? {
					WatchedPartially: { percentage_watched: Math.ceil(stats.progress) || 1 }
			  }
			: {
					WatchedMultipleTimes: {
						percentage_watched: Math.ceil(stats.progress) || 1,
						watch_count: stats.count
					}
			  };
	Log({ from: '0 updateStats', id: stats.videoId, payload }, 'info');
	await individualUser(stats.canisterId).update_post_add_view_details(stats.videoId, payload);
}

async function recordView(post?: PostPopulated) {
	if (!post) return;
	const { watchHistoryIdb } = await import('$lib/utils/idb');
	const postHistory: PostPopulatedHistory = {
		...post,
		watched_at: Date.now()
	};
	await watchHistoryIdb.set(post.publisher_canister_id + '@' + post.post_id, postHistory);
}

async function handleChange(e: CustomEvent) {
	const index = e.detail[0].realIndex;
	currentVideoIndex = index;
	Log({ currentVideoIndex, source: '0 handleChange' }, 'info');
	updateStats(currentPlayingIndex);
	playVideo(index);
	recordView(videos[currentVideoIndex]);
	fetchNextVideos();
	updateURL(videos[currentVideoIndex]);
	updateMetadata(videos[currentVideoIndex]);
}

function updateMetadata(video?: PostPopulated) {
	if (!video) return;
	if (!('mediaSession' in navigator)) return;
	navigator.mediaSession.metadata = new MediaMetadata({
		title: video.description,
		artist: video.created_by_display_name[0] || video.created_by_unique_user_name[0] || '',
		album: 'Hot or Not',
		artwork: [{ src: getThumbnailUrl(video.video_uid), type: 'image/png' }]
	});
}

const playVideo = debounce(50, async (index: number) => {
	videoPlayers[currentPlayingIndex]?.stop();
	videoPlayers[index]?.play();
	videoPlayers[index + 1]?.stop();
	currentPlayingIndex = index;
});

function updateURL(post?: PostPopulated) {
	if (!post) return;
	const url = post.publisher_canister_id + '@' + post.post_id;
	$playerState.currentVideoUrl = url;
	window.history.replaceState('', '', url);
}

function recordStats(progress: number, canisterId: Principal, videoId: bigint) {
	if (videoStats[currentPlayingIndex]) {
		videoStats[currentPlayingIndex].progress = progress;
		if (progress == 0) videoStats[currentPlayingIndex].count++;
	} else {
		videoStats[currentPlayingIndex] = {
			progress,
			videoId,
			canisterId,
			count: 0
		};
	}
}

onMount(async () => {
	individualUser = (await import('$lib/helpers/backend')).individualUser;
	updateURL();
	$playerState.initialized = false;
	$playerState.muted = true;
	await fetchNextVideos();
});
</script>

<SplashScreen />

<Swiper
	direction="{'vertical'}"
	observer
	slidesPerView="{1}"
	on:slideChange="{handleChange}"
	cssMode
	spaceBetween="{100}"
	class="h-full w-full">
	{#each videos as video, i (i)}
		{@const src = getMp4Url(video.video_uid)}
		<SwiperSlide class="flex h-full w-full snap-always items-center justify-center">
			{#if currentVideoIndex - keepVideosLoadedCount < i && currentVideoIndex + keepVideosLoadedCount > i}
				<VideoPlayer
					on:watchedPercentage="{({ detail }) =>
						recordStats(detail, video.publisher_canister_id, video.id)}"
					bind:this="{videoPlayers[i]}"
					i="{i}"
					id="{video.id}"
					displayName="{video.created_by_display_name[0]}"
					profileLink="{video.created_by_unique_user_name[0] ?? video.created_by_user_principal_id}"
					liked="{video.liked_by_me}"
					createdById="{video.created_by_user_principal_id}"
					videoViews="{Number(video.total_view_count)}"
					publisherCanisterId="{video.publisher_canister_id}"
					userProfileSrc="{video.created_by_profile_photo_url[0]}"
					individualUser="{individualUser}"
					inView="{i == currentVideoIndex}"
					swiperJs
					thumbnail="{getThumbnailUrl(video.video_uid)}"
					src="{src}" />
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
