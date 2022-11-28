<script lang="ts">
import NoBetsIcon from '$components/icons/NoBetsIcon.svelte';
import HotOrNot from '$components/navigation/HotOrNot.svelte';
import HotOrNotPlayer from '$components/video/HotOrNotPlayer.svelte';
import type { IndividualUserActor } from '$lib/helpers/backend';
import { getHotOrNotPosts, type PostPopulated } from '$lib/helpers/feed';
import { getMp4Url, getThumbnailUrl } from '$lib/utils/cloudflare';
import Log from '$lib/utils/Log';
import { playerState } from '$stores/playerState';
import { hideSplashScreen } from '$stores/splashScreen';
import type { Principal } from '@dfinity/principal';
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
let videoPlayers: HotOrNotPlayer[] = [];
let individualUser: (principal?: Principal | string) => IndividualUserActor;
let fetchedVideosCount = 0;

async function fetchNextVideos() {
	// console.log(`to fetch: ${!noMoreVideos} && ${videos.length}-${currentVideoIndex}<${fetchCount}`);
	if (!noMoreVideos && videos.length - currentVideoIndex < fetchWhenVideosLeft) {
		try {
			Log({ res: 'fetching from ' + fetchedVideosCount, source: '0 fetchNextVideos' }, 'info');
			loading = true;
			const res = await getHotOrNotPosts(fetchedVideosCount, fetchCount);
			console.log('res', res);
			if (res.error) {
				// TODO: Handle error
				loading = false;
				return;
			}

			fetchedVideosCount = res.from;
			if (res.posts.length) {
				videos = [...videos, ...res.posts];
			}

			if (!res.noMorePosts && res.posts.length == 0) {
				fetchNextVideos();
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
	$playerState.currentHotOrNotUrl = url;
	window.history.replaceState('', '', url);
}

onMount(async () => {
	individualUser = (await import('$lib/helpers/backend')).individualUser;
	$playerState.initialized = false;
	$playerState.muted = true;
	if (data.post) {
		videos = [data.post, ...videos];
	}
	await tick();
	await fetchNextVideos();
	updateURL(videos[currentVideoIndex]);
});
</script>

<hot-or-not>
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
					<HotOrNotPlayer
						on:loaded="{() => hideSplashScreen(500)}"
						bind:this="{videoPlayers[i]}"
						i="{i}"
						id="{video.id}"
						displayName="{video.created_by_display_name[0]}"
						profileLink="{video.created_by_unique_user_name[0] ??
							video.created_by_user_principal_id}"
						description="{video.description}"
						createdById="{video.created_by_user_principal_id}"
						videoViews="{Number(video.total_view_count)}"
						publisherCanisterId="{video.publisher_canister_id}"
						userProfileSrc="{video.created_by_profile_photo_url[0]}"
						individualUser="{individualUser}"
						nextVideo="{currentVideoIndex + 1 == i || currentVideoIndex + 2 == i}"
						inView="{i == currentVideoIndex}"
						swiperJs
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
			<SwiperSlide class="relative h-full w-full items-center justify-center">
				<div
					class="absolute flex h-full w-full flex-col items-center justify-center space-y-8 bg-black/50 px-8">
					<NoBetsIcon class="w-56" />
					<div class="text-center text-lg font-bold">There are no more videos to bet on</div>
					<div class="absolute inset-x-0 bottom-0 z-[-1] max-h-48">
						<HotOrNot />
					</div>
				</div>
			</SwiperSlide>
		{/if}
	</Swiper>
</hot-or-not>
