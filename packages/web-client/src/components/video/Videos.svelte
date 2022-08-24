<script lang="ts">
import NoVideosIcon from '$components/icons/NoVideosIcon.svelte';
import { db, type VideoDB } from '$lib/mockDb';
import { playerState } from '$stores/playerState';
import { onMount, tick } from 'svelte';
import { debounce } from 'throttle-debounce';
import VideoPlayer from './VideoPlayer.svelte';

export let fetchFromId: number = 0;
export let videos: VideoDB[] = [];
export let fetchCount: number = 5;
export let keepVideosLoadedCount: number = 4;

let currentVideoIndex = 0;
let nextObserver: IntersectionObserver | undefined = undefined;
let prevObserver: IntersectionObserver | undefined = undefined;
let moreVideos = true;
let parentEl: HTMLElement;
let videoPlayers: VideoPlayer[] = [];
let playingIndex: number | null = 0;
let loading = false;

async function fetchNextVideos() {
	// console.log('to fetch', videos.length, '-', currentVideoIndex, '<', fetchCount);
	if (moreVideos && videos.length - currentVideoIndex < fetchCount) {
		try {
			// console.log('fetching', { fetchFromId });
			loading = true;
			const res = db.getVideos(fetchFromId);
			videos = [...videos, ...res.videos];
			fetchFromId = res.nextCount;
			moreVideos = res.videosLeft;
			loading = false;
		} catch (e) {
			console.error(e);
			loading = false;
		}

		// console.log('fetched', { fetchFromId, videos });
	}
}

const handleNextIntersect = debounce(25, async (entries: IntersectionObserverEntry[]) => {
	if (entries[0].isIntersecting) {
		console.log('intersecting next video', entries[0]);
		currentVideoIndex++;
		updateURL();
		await playVideo();
		await nextObserver?.disconnect();
		updateObservers();
		fetchNextVideos();
	}
});

const handlePrevIntersect = debounce(25, async (entries: IntersectionObserverEntry[]) => {
	if (entries[0].isIntersecting) {
		console.log('intersecting prev video', entries[0]);
		if (currentVideoIndex > 0) {
			currentVideoIndex--;
			await playVideo();
		}
		updateURL();
		await prevObserver?.disconnect();
		updateObservers();
		fetchNextVideos();
	}
});

async function updateObservers() {
	await tick();
	if (!nextObserver) {
		nextObserver = new IntersectionObserver(handleNextIntersect, {
			root: parentEl,
			threshold: 0.8
		});
	}
	if (!prevObserver) {
		prevObserver = new IntersectionObserver(handlePrevIntersect, {
			root: parentEl,
			threshold: 0.8
		});
	}
	if (parentEl.children[currentVideoIndex + 1]?.tagName === 'PLAYER')
		nextObserver.observe(parentEl.children[currentVideoIndex + 1]);
	if (parentEl.children[currentVideoIndex - 1]?.tagName === 'PLAYER')
		prevObserver.observe(parentEl.children[currentVideoIndex - 1]);
}

const playVideo = debounce(100, async () => {
	if (playingIndex != undefined) {
		await videoPlayers[playingIndex].stop();
		playingIndex = null;
	}
	videoPlayers[currentVideoIndex].play();
	playingIndex = currentVideoIndex;
});

function updateURL() {
	if (videos[currentVideoIndex])
		window.history.replaceState('', '', `${videos[currentVideoIndex].id}`);
}

onMount(async () => {
	updateURL();
	$playerState.initialized = false;
	$playerState.muted = true;
	await fetchNextVideos();
	await updateObservers();
});

$: console.log({ currentVideoIndex });
</script>

<all-videos
	on:click|once="{() => ($playerState.initialized = true)}"
	bind:this="{parentEl}"
	class="hide-scrollbar relative block h-full w-full snap-y snap-mandatory overflow-hidden overflow-y-auto bg-black"
>
	{#each videos as video, i (video.url)}
		<VideoPlayer
			bind:this="{videoPlayers[i]}"
			load="{currentVideoIndex - keepVideosLoadedCount < i &&
				currentVideoIndex + keepVideosLoadedCount > i}"
			src="{video.url}"
		/>
	{/each}
	{#if loading}
		<div
			class="relative flex h-full w-auto snap-center snap-always flex-col items-center justify-center space-y-8 px-8"
		>
			<div class="text-center text-lg font-bold">Loading</div>
		</div>
	{/if}
	{#if !moreVideos}
		<div
			class="relative flex h-full w-auto snap-center snap-always flex-col items-center justify-center space-y-8 px-8"
		>
			<NoVideosIcon class="w-56" />
			<div class="text-center text-lg font-bold">No more videos to display today</div>
		</div>
	{/if}
</all-videos>
