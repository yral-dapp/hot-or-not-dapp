<script lang="ts">
import NoVideosIcon from '$components/icons/NoVideosIcon.svelte';
import { registerEvent } from '$components/seo/GoogleAnalytics.svelte';
import ShakaPlayer from '$components/video/ShakaPlayer.svelte';
import { individualUser } from '$lib/helpers/backend';
import {
	getTopPosts,
	getWatchedVideosFromCache,
	type PostPopulated,
	type PostPopulatedHistory
} from '$lib/helpers/feed';
import { getDashUrl, getHlsUrl, getMp4Url, getThumbnailUrl } from '$lib/utils/cloudflare';
import Log from '$lib/utils/Log';
import { handleParams } from '$lib/utils/params';
import { playerState } from '$stores/playerState';
import { hideSplashScreen } from '$stores/splashScreen';
import userProfile from '$stores/userProfile';
import { Principal } from '@dfinity/principal';
import { onMount, tick } from 'svelte';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/svelte';
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
let shaka: any;
let videoEl: HTMLVideoElement;
let player: shaka.Player;
let ready = false;
let currentTime = 0;
let useExternalAudio = false;

type VideoViewReport = {
	progress: number;
	videoId: bigint;
	canisterId: string;
	profileId: string;
	count: number;
	score: bigint;
};

let videoStats: Record<number, VideoViewReport> = {};

function joinArrayUniquely<T>(a: T[], b: T[]): T[] {
	const arrayWithoutNoDuplicates = [...a, ...b].filter(
		(value: any, index, self) =>
			index ===
			self.findIndex(
				(t: any) =>
					t.post_id === value.post_id && t.publisher_canister_id === value.publisher_canister_id
			)
	);
	return arrayWithoutNoDuplicates;
}

async function fetchNextVideos() {
	await tick();
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
	registerEvent('view_video', {
		userId: $userProfile.principal_id,
		video_publisher_id: stats.profileId,
		video_publisher_canister_id: stats.canisterId,
		video_id: stats.videoId,
		watch_count: Math.ceil(stats.count + stats.progress),
		home_feed_score: stats.score
	});
	await individualUser(Principal.from(stats.canisterId)).update_post_add_view_details(
		stats.videoId,
		payload
	);
}

async function recordView(post?: PostPopulated) {
	if (!post) return;
	const postHistory: PostPopulatedHistory = {
		...post,
		watched_at: Date.now()
	};
	const { watchHistoryIdb } = await import('$lib/utils/idb');
	await watchHistoryIdb.set(post.publisher_canister_id + '@' + post.post_id, postHistory);
}

async function handleChange(e: CustomEvent) {
	ready = false;
	currentTime = 0;
	const index = e.detail[0].realIndex;
	currentVideoIndex = index;
	Log({ currentVideoIndex, source: '0 handleChange' }, 'info');
	updateStats(currentPlayingIndex);
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

function updateURL(post?: PostPopulated) {
	if (!post) return;
	const url = post.publisher_canister_id + '@' + post.post_id;
	$playerState.currentFeedUrl = url;
	window.history.replaceState('', '', url);
}

function recordStats(
	progress: number,
	canisterId: string,
	videoId: bigint,
	profileId: string,
	score: bigint
) {
	if (videoStats[currentPlayingIndex]) {
		videoStats[currentPlayingIndex].progress = progress;
		if (progress == 0) videoStats[currentPlayingIndex].count++;
	} else {
		videoStats[currentPlayingIndex] = {
			progress,
			videoId,
			canisterId,
			profileId,
			count: 0,
			score
		};
	}
}

function handleClick() {
	videoEl.muted = !videoEl.muted;
	$playerState.muted = videoEl.muted;
}

async function loadNewVideo(src: string) {
	if (!player) {
		player = new shaka.Player(videoEl);
	}
	await player.load(src);
	videoEl.play();
}

function initPlayer() {
	if (useExternalAudio) {
		loadNewVideo(getDashUrl(videos[0].video_uid));
	}
}

$: if (currentTime > 0 && currentTime < 1 && !ready) {
	ready = true;
}

onMount(async () => {
	useExternalAudio = !!videoEl.canPlayType('application/vnd.apple.mpegurl');
	updateURL();
	handleParams();
	//@ts-ignore
	shaka = await import('shaka-player/dist/shaka-player.compiled.js');
	await shaka.polyfill.installAll();
	$playerState.initialized = false;
	$playerState.muted = true;
	if (data.post) {
		videos = [data.post, ...videos];
		await recordView(data.post);
	}
	initPlayer();
	await fetchNextVideos();
});
</script>

<svelte:head>
	<title>Home Feed | Hot or Not</title>
</svelte:head>

<div class="relative h-full w-full">
	<div class="z-[11] absolute inset-0 flex items-center justify-center pointer-events-none">
		<video
			on:click="{handleClick}"
			class="opacity-0 border h-20 w-20 {useExternalAudio ? 'pointer-events-auto' : ''} "
			bind:this="{videoEl}"
			loop
			playsinline
			x-webkit-airplay="deny"
			disableremoteplayback
			preload="metadata"
			bind:currentTime="{currentTime}"
			muted>
		</video>
	</div>
	<div class="h-full w-full absolute z-10">
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
							on:inView="{({ detail }) => {
								useExternalAudio && loadNewVideo(detail);
							}}"
							on:loaded="{() => hideSplashScreen(500)}"
							on:watchedPercentage="{({ detail }) =>
								recordStats(
									detail,
									video.publisher_canister_id,
									video.id,
									video.created_by_unique_user_name[0] ?? video.created_by_user_principal_id,
									video.home_feed_ranking_score
								)}"
							i="{i}"
							id="{video.id}"
							displayName="{video.created_by_display_name[0]}"
							profileLink="{video.created_by_unique_user_name[0] ??
								video.created_by_user_principal_id}"
							liked="{video.liked_by_me}"
							description="{video.description}"
							createdById="{video.created_by_user_principal_id}"
							videoViews="{Number(video.total_view_count)}"
							publisherCanisterId="{video.publisher_canister_id}"
							userProfileSrc="{video.created_by_profile_photo_url[0]}"
							individualUser="{individualUser}"
							inView="{i == currentVideoIndex}"
							ready="{ready}"
							enrolledInHotOrNot="{video.hot_or_not_feed_ranking_score &&
								video.hot_or_not_feed_ranking_score[0] !== undefined}"
							thumbnail="{getThumbnailUrl(video.video_uid)}"
							shaka="{shaka}"
							externalAudio="{useExternalAudio}"
							likeCount="{video.like_count}"
							src="{useExternalAudio ? getHlsUrl(video.video_uid) : getDashUrl(video.video_uid)}" />
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
</div>
