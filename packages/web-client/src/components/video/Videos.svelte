<script lang="ts">
import { db } from '$lib/mockDb';
import { onMount } from 'svelte';
import VideoPlayer from './VideoPlayer.svelte';

let currentVideoIndex = 0;
let nextVideoCount = 1;
let videos: string[] = [];
let videosCount = 0;

let observeLastVideo: IntersectionObserver | undefined = undefined;
let observeNextVideo: IntersectionObserver | undefined = undefined;
let parentEl: HTMLElement;

async function fetchNextVideos() {
	console.log('to fetch', nextVideoCount - currentVideoIndex, '<', 4);
	if (currentVideoIndex == 0 || nextVideoCount - currentVideoIndex < 4) {
		console.log('fetching', { nextVideoCount, videos });
		const res = db.getVideos(nextVideoCount, 3);

		videos = [...videos, ...res.videos];
		nextVideoCount = res.nextCount;
		videosCount = res.total;
		console.log('fetched', { nextVideoCount, videos });
	}
}

function selectLastElement() {
	if (observeLastVideo) {
		observeLastVideo.disconnect();
	}
	if (currentVideoIndex == 0) return;
	// console.log('prev video is: ', parentEl.children[currentVideoIndex - 1]);
	observeLastVideo = new IntersectionObserver(
		async (entries) => {
			// console.log('lastVideoEntries', entries);
			if (entries[0].isIntersecting) {
				// console.log('intersecting last video');
				currentVideoIndex > 0 && currentVideoIndex--;
				selectLastElement();
				updateURL();
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
	if (currentVideoIndex == videosCount - 1) return;
	// console.log('next video is: ', parentEl.children[currentVideoIndex + 1]);
	observeNextVideo = new IntersectionObserver(
		async (entries) => {
			// console.log('nextVideoEntries', entries);
			if (entries[0].isIntersecting) {
				// console.log('intersecting next video');
				currentVideoIndex++;
				selectLastElement();
				updateURL();
				selectNextElement();
				fetchNextVideos();
			}
		},
		{
			threshold: 0.9
		}
	);
	observeNextVideo.observe(parentEl.children[currentVideoIndex + 1]);
}

function updateURL() {
	console.log('udpating url');
	window.history.pushState('', '', `/${currentVideoIndex}`);
}

onMount(async () => {
	updateURL();
	await fetchNextVideos();
	await selectLastElement();
	await selectNextElement();
});
</script>

<all-videos
	bind:this="{parentEl}"
	class="hide-scrollbar relative block h-screen w-full snap-y snap-mandatory overflow-hidden overflow-y-auto"
>
	{#each videos as video, i (video)}
		<VideoPlayer
			paused="{i != currentVideoIndex}"
			load="{currentVideoIndex - 2 < i && currentVideoIndex + 2 > i}"
			src="{video}"
		/>
	{/each}
</all-videos>
