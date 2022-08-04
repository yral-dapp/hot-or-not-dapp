<script lang="ts">
import { db, type VideoDB } from '$lib/mockDb';
import { playerInitialized } from '$stores/playerInitialization';
import { onMount } from 'svelte';
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
$: innerHeight = window?.innerHeight;

async function fetchNextVideos() {
	// console.log('to fetch', videos.length, '-', currentVideoIndex, '<', fetchCount);
	if (moreVideos && videos.length - currentVideoIndex < fetchCount) {
		console.log('fetching', { fetchFromId });
		const res = db.getVideos(fetchFromId);

		videos = [...videos, ...res.videos];
		fetchFromId = res.nextCount;
		moreVideos = res.videosLeft;
		console.log('fetched', { fetchFromId, videos });
	}
}

function selectLastElement() {
	if (observeLastVideo) observeLastVideo.disconnect();

	if (!parentEl.children[currentVideoIndex - 1]) return;

	observeLastVideo = new IntersectionObserver(
		async (entries) => {
			if (entries[0].isIntersecting) {
				if (currentVideoIndex > 0) currentVideoIndex--;
				selectLastElement();
				updateURL();
				selectNextElement();
			}
		},
		{
			threshold: 0.7
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
			// console.log('nextVideoEntries', entries);
			if (entries[0].isIntersecting) {
				// console.log('intersecting next video');
				if (currentVideoIndex < videos.length) currentVideoIndex++;
				selectLastElement();
				updateURL();
				selectNextElement();
				fetchNextVideos();
			}
		},
		{
			threshold: 0.7
		}
	);
	observeNextVideo.observe(parentEl.children[currentVideoIndex + 1]);
}

function updateURL() {
	if (videos[currentVideoIndex])
		window.history.replaceState('', '', `${videos[currentVideoIndex].id}`);
}

onMount(async () => {
	updateURL();
	$playerInitialized = false;
	await fetchNextVideos();
	await selectLastElement();
	await selectNextElement();
});
</script>

<svelte:window on:resize="{() => (innerHeight = window?.innerHeight)}" />

<all-videos
	bind:this="{parentEl}"
	style="height: 100vh; {innerHeight ? `height: ${innerHeight}px` : ''}"
	class="hide-scrollbar relative block w-full snap-y snap-mandatory overflow-hidden overflow-y-auto"
>
	{#each videos as video, i (video.url)}
		<VideoPlayer
			paused="{i != currentVideoIndex}"
			load="{currentVideoIndex - keepVideosLoadedCount < i &&
				currentVideoIndex + keepVideosLoadedCount > i}"
			src="{video.url}"
		/>
	{/each}
</all-videos>
