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
let observer: IntersectionObserver | undefined = undefined;
let moreVideos = true;
let parentEl: HTMLElement;
let videoPlayers: VideoPlayer[] = [];
let loading = false;

async function fetchNextVideos() {
	console.log('to fetch', videos.length, '-', currentVideoIndex, '<', fetchCount);
	if (moreVideos && videos.length - currentVideoIndex < fetchCount) {
		try {
			// console.log('fetching', { fetchFromId });
			loading = true;
			const res = db.getVideos(fetchFromId);
			videos = [...videos, ...res.videos];
			fetchFromId = res.nextCount;
			moreVideos = res.videosLeft;
			loading = false;
			// console.log('fetched', videos);
		} catch (e) {
			console.error(e);
			loading = false;
		}
	}
}

const handleNextIntersect = debounce(25, async (entries: IntersectionObserverEntry[]) => {
	entries.forEach((entry) => {
		const index = Number(entry.target.getAttribute('i'));
		if (entry.isIntersecting) {
			if (index > currentVideoIndex) {
				if (parentEl.children[index - 2]) observer?.unobserve(parentEl.children[index - 2]);
				if (parentEl.children[index + 2]) observer?.observe(parentEl.children[index + 2]);
			} else if (index < currentVideoIndex) {
				if (parentEl.children[currentVideoIndex - 2])
					observer?.observe(parentEl.children[currentVideoIndex - 2]);
				if (parentEl.children[currentVideoIndex + 2])
					observer?.unobserve(parentEl.children[currentVideoIndex + 2]);
			}
			// console.log(index, 'intersected');
			currentVideoIndex = index;
			playVideo(index);
			fetchNextVideos();
			updateURL();
		} else {
			try {
				videoPlayers[index].stop();
			} catch (e) {
				console.warn('Could not pause');
			}
		}
	});
});

async function updateObservers() {
	await tick();
	if (!observer) {
		observer = new IntersectionObserver(handleNextIntersect, {
			root: parentEl,
			threshold: 0.8
		});
	}
	if (parentEl.children[currentVideoIndex - 2])
		observer.observe(parentEl.children[currentVideoIndex - 2]);
	if (parentEl.children[currentVideoIndex - 1])
		observer.observe(parentEl.children[currentVideoIndex - 1]);
	if (parentEl.children[currentVideoIndex]) observer.observe(parentEl.children[currentVideoIndex]);
	if (parentEl.children[currentVideoIndex + 1])
		observer.observe(parentEl.children[currentVideoIndex + 1]);
	if (parentEl.children[currentVideoIndex + 2])
		observer.observe(parentEl.children[currentVideoIndex + 2]);
}

const playVideo = debounce(300, async (index: number) => {
	videoPlayers[index].play();
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
</script>

<all-videos
	on:click|once="{() => ($playerState.initialized = true)}"
	bind:this="{parentEl}"
	class="relative block h-full w-full snap-y snap-mandatory overflow-hidden overflow-y-scroll bg-black"
>
	{#each videos as video, i (i)}
		<VideoPlayer
			i="{i}"
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
