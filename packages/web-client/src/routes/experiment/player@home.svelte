<script lang="ts">
import Avatar from '$components/avatar/Avatar.svelte';
import Button from '$components/button/Button.svelte';
import { onMount } from 'svelte';
import Video from '$components/video/Video.svelte';

let db = {
	videos: [
		'https://assets.mixkit.co/videos/preview/mixkit-weeds-waving-in-the-breeze-1178-large.mp4',
		'https://assets.mixkit.co/videos/preview/mixkit-stunning-sunset-seen-from-the-sea-4119-large.mp4',
		'https://assets.mixkit.co/videos/preview/mixkit-metal-surface-engraved-with-ornaments-34505-large.mp4',
		'https://assets.mixkit.co/videos/preview/mixkit-a-brush-painting-on-a-blue-wall-2308-large.mp4',
		'https://assets.mixkit.co/videos/preview/mixkit-computer-fan-with-neon-lights-2382-large.mp4',
		'https://assets.mixkit.co/videos/preview/mixkit-fountain-in-a-garden-2674-large.mp4',
		'https://assets.mixkit.co/videos/preview/mixkit-old-street-at-night-3456-large.mp4',
		'https://assets.mixkit.co/videos/preview/mixkit-tourists-skiing-on-a-snowy-slope-in-canada-3351-large.mp4'
	]
};

let loadedVideos = [
	'https://assets.mixkit.co/videos/preview/mixkit-weeds-waving-in-the-breeze-1178-large.mp4',
	'https://assets.mixkit.co/videos/preview/mixkit-stunning-sunset-seen-from-the-sea-4119-large.mp4',
	'https://assets.mixkit.co/videos/preview/mixkit-metal-surface-engraved-with-ornaments-34505-large.mp4',
	'https://assets.mixkit.co/videos/preview/mixkit-a-brush-painting-on-a-blue-wall-2308-large.mp4'
];

let showDrawer = true;
let parentEl: HTMLElement;
let canvasEl: HTMLCanvasElement;
let dragEl: HTMLElement;

let observeLastVideo: IntersectionObserver | undefined = undefined;
let currentVideoIndex: number = 0;
let observeNextVideo: IntersectionObserver | undefined = undefined;

function selectLastElement() {
	if (observeLastVideo) {
		observeLastVideo.disconnect();
	}
	if (currentVideoIndex == 0) return;
	// console.log('prev video is: ', parentEl.children[currentVideo - 1]);
	observeLastVideo = new IntersectionObserver(
		async (entries) => {
			// console.log('lastVideoEntries', entries);
			if (entries[0].isIntersecting) {
				console.log('intersecting last video');
				currentVideoIndex > 0 && currentVideoIndex--;
				selectLastElement();
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
	if (currentVideoIndex == db.videos.length - 1) return;
	// console.log('next video is: ', parentEl.children[currentVideoIndex + 1]);
	observeNextVideo = new IntersectionObserver(
		async (entries) => {
			// console.log('nextVideoEntries', entries);
			if (entries[0].isIntersecting) {
				// console.log('intersecting next video');
				currentVideoIndex++;
				selectLastElement();
				selectNextElement();
			}
		},
		{
			threshold: 0.9
		}
	);
	observeNextVideo.observe(parentEl.children[currentVideoIndex + 1]);
}

onMount(async () => {
	await selectLastElement();
	await selectNextElement();
	if (dragEl) {
		console.log('exists');
		height = dragEl.getBoundingClientRect().top;
	}
});

let isDragging = false;
let offsetY = 0;
let height = 0;

$: console.log('y', offsetY, isDragging);

$: console.log({ currentVideoIndex, observeLastVideo, observeNextVideo });
</script>

<canvas class="hidden" bind:this="{canvasEl}"></canvas>

<div class="h-full w-full overflow-auto">
	<div
		bind:this="{parentEl}"
		class="relative h-screen w-full snap-y snap-mandatory overflow-hidden overflow-y-auto bg-black"
	>
		{#each db.videos as video, i}
			<Video
				canvasEl="{canvasEl}"
				paused="{i != currentVideoIndex}"
				load="{currentVideoIndex - 2 < i && currentVideoIndex + 2 > i}"
				src="{video}"
			/>
		{/each}
	</div>
	<div class="absolute top-2 z-[5] opacity-30">
		<!-- <Logo /> -->
	</div>
	<div class="absolute bottom-4 z-[5] flex w-full justify-center">
		<button
			on:click="{() => (showDrawer = true)}"
			class="border-1 rounded-full border-white bg-black p-4 text-white">Open Drawer</button
		>
	</div>

	<div
		on:mousemove="{(e) => {
			if (isDragging) {
				offsetY = e.offsetY;
			}
		}}"
		on:touchmove="{(e) => {
			if (isDragging && e.touches[0]) {
				offsetY = e.touches[0].clientY;
			}
		}}"
		style="transform: translateY({showDrawer ? (isDragging ? `${offsetY}px` : '0%') : '100%'});"
		on:mouseup="{() => {
			isDragging = false;
			offsetY = 0;
		}}"
		on:touchend="{() => {
			isDragging = false;
			offsetY = 0;
		}}"
		class="{isDragging
			? 'transition-none'
			: 'transition-all duration-200'} absolute bottom-0 z-[6] flex h-1/2 w-full flex-col items-center rounded-t-2xl border-2 bg-black p-4 "
	>
		<div
			draggable
			bind:this="{dragEl}"
			on:mousedown="{() => (isDragging = true)}"
			on:touchstart="{() => (isDragging = true)}"
			class="flex w-full cursor-grab select-none items-center justify-center border-2 border-white/10 py-2 active:cursor-grabbing"
		>
			<div class="h-[2px] w-24 rounded-full bg-white/50"></div>
		</div>
		<Avatar
			src="https://images.pexels.com/photos/11306305/pexels-photo-11306305.jpeg"
			class="h-8 w-8"
		/>
		<Button type="secondary" class="w-full max-w-md" on:click>Close</Button>
	</div>
</div>
