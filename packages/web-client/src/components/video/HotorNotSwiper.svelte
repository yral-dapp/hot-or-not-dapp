<script lang="ts">
import { db, type VideoDB } from '$lib/db/mockDb';
import { playerState } from '$stores/playerState';
import { onMount, tick } from 'svelte';
import { Swiper, SwiperSlide } from 'swiper/svelte';
import 'swiper/css';
import { debounce } from 'throttle-debounce';
import type { IndividualUserCanister } from '$lib/helpers/backend';
import HotOrNotPlayer from './HotOrNotPlayer.svelte';
import NoBetsIcon from '$components/icons/NoBetsIcon.svelte';
import HotOrNot from '$components/navigation/HotOrNot.svelte';
import Log from '$lib/utils/Log';

export let fetchFromId: number = 0;
export let videos: VideoDB[] = [];
export let fetchCount: number = 5;
export let keepVideosLoadedCount: number = 4;

let currentVideoIndex = 0;
let moreVideos = true;
let loading = false;
let currentPlayingIndex = 0;
let videoPlayers: HotOrNotPlayer[] = [];
let individualUser: () => IndividualUserCanister;

async function fetchNextVideos() {
	// console.log('to fetch', videos.length, '-', currentVideoIndex, '<', fetchCount);
	if (moreVideos && videos.length - currentVideoIndex < fetchCount) {
		try {
			Log({ hnn: true, res: 'fetching', fetchFromId, source: '0 fetchNextVideos' }, 'info');
			loading = true;
			const res = db.getVideos(fetchFromId);
			videos = [...videos, ...res.videos];
			await tick();
			fetchFromId = res.nextCount;
			moreVideos = res.videosLeft;
			loading = false;

			Log(
				{ hnn: true, res: 'fetched', fetchFromId, moreVideos, source: '0 fetchNextVideos' },
				'info'
			);
		} catch (e) {
			Log({ error: e, hnn: true, fetchFromId, moreVideos, source: '1 fetchNextVideos' }, 'error');
			loading = false;
		}
	}
}

async function handleChange(e: CustomEvent) {
	const index = e.detail[0].realIndex;
	currentVideoIndex = index;
	$playerState.currentHotOrNotIndex = currentVideoIndex;
	Log({ hnn: true, currentVideoIndex, source: '0 handleChange' }, 'info');
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

<hot-or-not>
	<Swiper
		direction="{'vertical'}"
		observer
		slidesPerView="{1}"
		on:slideChange="{handleChange}"
		cssMode
		spaceBetween="{100}"
		class="h-full w-full"
	>
		{#each videos as video, i (i)}
			<SwiperSlide class="flex h-full w-full snap-always items-center justify-center">
				{#if currentVideoIndex - keepVideosLoadedCount < i && currentVideoIndex + keepVideosLoadedCount > i}
					<HotOrNotPlayer
						bind:this="{videoPlayers[i]}"
						i="{i}"
						individualUser="{individualUser}"
						inView="{i == currentVideoIndex}"
						swiperJs
						src="{video.url}"
					/>
				{/if}
			</SwiperSlide>
		{/each}
		{#if loading}
			<SwiperSlide class="flex h-full w-full items-center justify-center">
				<div
					class="relative flex h-full w-full flex-col items-center justify-center space-y-8 px-8"
				>
					<div class="text-center text-lg font-bold">Loading</div>
				</div>
			</SwiperSlide>
		{/if}
		{#if !moreVideos}
			<SwiperSlide class="relative h-full w-full items-center justify-center">
				<div
					class="absolute flex h-full w-full flex-col items-center justify-center space-y-8 bg-black/50 px-8"
				>
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
