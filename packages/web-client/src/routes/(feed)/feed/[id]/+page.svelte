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
import { getTopPosts, type PostPopulated } from '$lib/helpers/feed';
import { getMp4Url, getThumbnailUrl } from '$lib/utils/cloudflare';

const fetchCount = 5;
let videos: PostPopulated[] = [];
let keepVideosLoadedCount: number = 4;
let currentVideoIndex = 0;
let moreVideos = true;
let loading = false;
let currentPlayingIndex = 0;
let videoPlayers: VideoPlayer[] = [];
let individualUser: () => IndividualUserActor;

async function fetchNextVideos() {
	// console.log('to fetch', videos.length, '-', currentVideoIndex, '<', fetchCount);
	if (moreVideos && videos.length - currentVideoIndex < fetchCount) {
		try {
			Log({ res: 'fetching from ' + videos.length, source: '0 fetchNextVideos' }, 'info');

			loading = true;
			const res = await getTopPosts(videos.length);
			if (res.error) {
				//TODO: Handle error
				loading = false;
				return;
			}

			moreVideos = !res.noMorePosts;

			videos.push(...res.posts);
			videos = videos;

			await tick();
			loading = false;

			Log({ res: 'fetched', moreVideos, source: '0 fetchNextVideos' }, 'info');
		} catch (e) {
			Log({ error: e, moreVideos, source: '1 fetchNextVideos' }, 'error');
			loading = false;
		}
	}
}

async function handleChange(e: CustomEvent) {
	const index = e.detail[0].realIndex;
	currentVideoIndex = index;
	Log({ currentVideoIndex, source: '0 handleChange' }, 'info');
	$playerState.currentVideosIndex = index;
	playVideo(index);
	fetchNextVideos();
	updateURL();
}

const playVideo = debounce(50, async (index: number) => {
	videoPlayers[currentPlayingIndex]?.stop();
	videoPlayers[index]?.play();
	videoPlayers[index + 1]?.stop();
	currentPlayingIndex = index;
});

function updateURL() {
	if (videos[currentVideoIndex])
		window.history.replaceState('', '', `${videos[currentVideoIndex].id}`);
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
					bind:this="{videoPlayers[i]}"
					i="{i}"
					id="{video.id}"
					displayName="{video.created_by_display_name[0]}"
					profileLink="{video.created_by_unique_user_name[0] ??
						video.created_by_user_principal_id.toText()}"
					liked="{video.liked_by_me}"
					createdById="{video.created_by_user_principal_id.toText()}"
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
	{#if !moreVideos}
		<SwiperSlide class="flex h-full w-full items-center justify-center">
			<div class="relative flex h-full w-full flex-col items-center justify-center space-y-8 px-8">
				<NoVideosIcon class="w-56" />
				<div class="text-center text-lg font-bold">No more videos to display today</div>
			</div>
		</SwiperSlide>
	{/if}
</Swiper>
