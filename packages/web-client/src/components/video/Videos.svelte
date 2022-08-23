<script lang="ts">
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
let observeLastVideo: IntersectionObserver | undefined = undefined;
let observeNextVideo: IntersectionObserver | undefined = undefined;
let moreVideos = true;
let parentEl: HTMLElement;
let videoPlayers: VideoPlayer[] = [];
let playingIndex: number | null = 0;

async function fetchNextVideos() {
	// console.log('to fetch', videos.length, '-', currentVideoIndex, '<', fetchCount);
	if (moreVideos && videos.length - currentVideoIndex < fetchCount) {
		// console.log('fetching', { fetchFromId });
		const res = db.getVideos(fetchFromId);

		videos = [...videos, ...res.videos];
		fetchFromId = res.nextCount;
		moreVideos = res.videosLeft;
		// console.log('fetched', { fetchFromId, videos });
	}
}

function selectLastElement() {
	if (observeLastVideo) observeLastVideo.disconnect();

	if (currentVideoIndex == 0 || !parentEl.children[currentVideoIndex - 1]) return;

	observeLastVideo = new IntersectionObserver(
		async (entries) => {
			// console.log('prevVideoEntries', entries);
			if (entries[0].isIntersecting) {
				// console.log('intersecting prev video');
				if (currentVideoIndex > 0) {
					currentVideoIndex--;
					await pausePrevVideo();
					await tick();
					await playNextVideo();
				}
				await tick();
				selectLastElement();
				updateURL();
				setTimeout(() => selectLastElement(), 25);
				selectNextElement();
			}
		},
		{
			threshold: 0.9
		}
	);

	observeLastVideo.observe(parentEl.children[currentVideoIndex - 1]);
}

function selectNextElement() {
	if (observeNextVideo) {
		observeNextVideo.disconnect();
	}
	if (!parentEl.children[currentVideoIndex + 1]) return;
	observeNextVideo = new IntersectionObserver(
		async (entries) => {
			if (entries[0].isIntersecting) {
				if (currentVideoIndex < videos.length) {
					currentVideoIndex++;
					await pausePrevVideo();
					await tick();
					await playNextVideo();
				}
				await tick();
				updateURL();
				selectNextElement();
				setTimeout(() => selectLastElement(), 25);
				fetchNextVideos();
			}
		},
		{
			threshold: 0.9
		}
	);
	observeNextVideo.observe(parentEl.children[currentVideoIndex + 1]);
}

const pausePrevVideo = debounce(100, async () => {
	if (playingIndex != undefined) {
		videoPlayers[playingIndex].stop();
		playingIndex = null;
	}
});

const playNextVideo = debounce(100, async () => {
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
	await selectLastElement();
	await selectNextElement();
});
</script>

<all-videos
	on:click|once="{() => ($playerState.initialized = true)}"
	bind:this="{parentEl}"
	class="hide-scrollbar relative block h-full w-full snap-y snap-mandatory overflow-hidden overflow-y-auto"
>
	{#each videos as video, i (video.url)}
		<VideoPlayer
			bind:this="{videoPlayers[i]}"
			load="{currentVideoIndex - keepVideosLoadedCount < i &&
				currentVideoIndex + keepVideosLoadedCount > i}"
			src="{video.url}"
		/>
	{/each}
</all-videos>
