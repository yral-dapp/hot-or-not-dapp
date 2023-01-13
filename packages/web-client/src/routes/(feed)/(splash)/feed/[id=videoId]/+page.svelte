<script lang="ts">
import NoVideosIcon from '$components/icons/NoVideosIcon.svelte';
import { registerEvent } from '$components/seo/GoogleAnalytics.svelte';
import VideoPlayer from '$components/video/VideoPlayer.svelte';
import { individualUser } from '$lib/helpers/backend';
import {
	getTopPosts,
	getWatchedVideosFromCache,
	type PostPopulated,
	type PostPopulatedHistory
} from '$lib/helpers/feed';
import { getThumbnailUrl } from '$lib/utils/cloudflare';
import Log from '$lib/utils/Log';
import { handleParams } from '$lib/utils/params';
import { playerState } from '$stores/playerState';
import { hideSplashScreen } from '$stores/splashScreen';
import userProfile from '$stores/userProfile';
import { Principal } from '@dfinity/principal';
import { onDestroy, onMount, tick } from 'svelte';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/svelte';
import type { PageData } from './$types';
import { isiPhone } from '$lib/utils/isSafari';
import { page } from '$app/stores';
import navigateBack from '$stores/navigateBack';
import HomeFeedPlayer from '$components/player/HomeFeedPlayer.svelte';
import Hls from 'hls.js';
import { joinArrayUniquely, updateMetadata, type VideoViewReport } from '$lib/utils/video';

export let data: PageData;

const fetchCount = 50;
const fetchWhenVideosLeft = 10;
const keepVideosLoadedCount: number = 3;

let videos: PostPopulated[] = [];
let videoPlayers: VideoPlayer[] = [];
let currentVideoIndex = 0;
let noMoreVideos = false;
let loading = false;
let currentPlayingIndex = 0;
let fetchedVideosCount = 0;
let isIPhone = isiPhone();
let isDocumentHidden = false;
let videoStats: Record<number, VideoViewReport> = {};

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

			videos = joinArrayUniquely(videos, res.posts);

			if (!res.noMorePosts && res.posts.length == 0) {
				fetchNextVideos();
			} else if (res.noMorePosts) {
				const watchedVideos = await getWatchedVideosFromCache();
				videos = joinArrayUniquely(videos, watchedVideos);
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
	updateStats(currentPlayingIndex);
	recordView(videos[currentVideoIndex]);
	fetchNextVideos();
	updateURL(videos[currentVideoIndex]);
	updateMetadata(videos[currentVideoIndex]);
	currentPlayingIndex = index;
}

function updateURL(post?: PostPopulated) {
	if (!post) return;
	const url = post.publisher_canister_id + '@' + post.post_id;
	$navigateBack = $playerState.currentFeedUrl = url;
	window.history.replaceState('', '', url);
}

function handleVisibilityChange() {
	if (document.visibilityState === 'hidden') {
		isDocumentHidden = true;
	} else {
		isDocumentHidden = false;
	}
}

async function updateStats(oldIndex) {
	const stats = videoStats[oldIndex] as VideoViewReport | undefined;
	if (!stats || (stats?.count === 0 && stats?.progress === 0)) {
		return;
	}

	delete videoStats[oldIndex];

	if ($page.url.host.includes('t:')) return;

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
	try {
		await watchHistoryIdb.set(post.publisher_canister_id + '@' + post.post_id, postHistory);
	} catch (e) {
		Log({ error: e, source: '0 recordView' }, 'error');
	}
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

onMount(async () => {
	updateURL();
	$playerState.initialized = false;
	$playerState.muted = true;
	if (data.post) {
		videos = [data.post, ...videos];
		await recordView(data.post);
	}
	await tick();
	await fetchNextVideos();
	handleParams();
	document.addEventListener('visibilitychange', handleVisibilityChange);
});

onDestroy(() => {
	document.removeEventListener('visibilitychange', handleVisibilityChange);
});
</script>

<svelte:head>
	<title>Home Feed | Hot or Not</title>
</svelte:head>

<Swiper
	direction="{'vertical'}"
	observer
	cssMode
	slidesPerView="{1}"
	on:slideChange="{handleChange}"
	spaceBetween="{300}"
	class="h-full w-full">
	{#each videos as video, i (i)}
		<SwiperSlide class="flex h-full w-full snap-always items-center justify-center">
			{#if currentVideoIndex - 2 < i && currentVideoIndex + keepVideosLoadedCount > i}
				<HomeFeedPlayer
					i="{i}"
					id="{video.id}"
					likeCount="{Number(video.like_count)}"
					displayName="{video.created_by_display_name[0]}"
					profileLink="{video.created_by_unique_user_name[0] ?? video.created_by_user_principal_id}"
					liked="{video.liked_by_me}"
					description="{video.description}"
					createdById="{video.created_by_user_principal_id}"
					videoViews="{Number(video.total_view_count)}"
					publisherCanisterId="{video.publisher_canister_id}"
					userProfileSrc="{video.created_by_profile_photo_url[0]}"
					individualUser="{individualUser}"
					enrolledInHotOrNot="{video.hot_or_not_feed_ranking_score &&
						video.hot_or_not_feed_ranking_score[0] !== undefined}"
					thumbnail="{getThumbnailUrl(video.video_uid)}">
					<VideoPlayer
						bind:this="{videoPlayers[i]}"
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
						playFormat="hls"
						Hls="{Hls}"
						isiPhone="{isIPhone}"
						inView="{i == currentVideoIndex && !isDocumentHidden}"
						uid="{video.video_uid}" />
				</HomeFeedPlayer>
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
