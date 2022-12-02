<script lang="ts">
import IconButton from '$components/button/IconButton.svelte';
import LoadingIcon from '$components/icons/LoadingIcon.svelte';
import SoundIcon from '$components/icons/SoundIcon.svelte';
import { isiPhone } from '$lib/utils/isSafari';
import Log from '$lib/utils/Log';
import { playerState } from '$stores/playerState';
import c from 'clsx';
import { createEventDispatcher, onMount } from 'svelte';

export let srcDash;
export let srcHls;
export let i: number;
export let inView = false;
export let thumbnail = '';
export let shaka: any;

const dispatch = createEventDispatcher<{
	loaded: void;
}>();

let player: shaka.Player;
let playerBg: shaka.Player;
let videoEl: HTMLVideoElement;
let videoBgEl: HTMLVideoElement;
let currentTime = 0;
let loaded = false;
let paused = true;
let hls = false

export function play() {
	try {
		if (videoEl) {
			videoEl.currentTime = 0.1;
			paused = false;
		}

		if (videoBgEl) {
			videoBgEl.currentTime = 0.1;
		}


		if (isiPhone()) return;
		if ($playerState.initialized && !$playerState.muted) {
			videoEl.muted = $playerState.muted = false;
		}
	} catch (e: any) {
		Log({ error: e, i, srcDash, inView, source: '1 play' }, 'error');

		if (videoEl) {
			$playerState.muted = true;
			videoEl.muted = true;
		}
	}
}

export function stop() {
	try {
		if (videoEl) {
			videoEl.currentTime = 0.1;
			paused = true;
		}
		if (videoBgEl) {
			videoBgEl.currentTime = 0.1;
		}
	} catch (e: any) {
		Log({ error: e, i, srcDash, inView, source: '2 stop' }, 'error');
	}
}

function handleClick() {
	try {
		if (videoEl) {
			if (paused) {
				play();
			} else {
				videoEl.muted = !videoEl.muted;
				$playerState.muted = videoEl.muted;
			}
		}
	} catch (e) {
		Log({ error: e, i, srcDash, inView, source: '1 handleClick' }, 'error');
	}
}

$: if (inView && loaded) {
	dispatch('loaded');
}

onMount(() => {
	hls = !!videoEl.canPlayType('application/vnd.apple.mpegurl')
	player = new shaka.Player(videoEl);
	playerBg = new shaka.Player(videoBgEl);
	player.load(hls? srcHls: srcDash);
	playerBg.load(hls? srcHls: srcDash);
	
	if (inView && paused) {
		paused = false;
	}
	
	return () => {
		player.destroy();
		playerBg.destroy();
	};
	
});
</script>

<player
	i="{i}"
	class="{c(
		'block h-full w-full items-center justify-center overflow-auto transition-all duration-500',
		loaded ? 'opacity-100' : 'opacity-0'
	)}">
	<!-- svelte-ignore a11y-media-has-caption -->
	<video
		on:click="{handleClick}"
		bind:this="{videoEl}"
		loop
		playsinline
		on:loadeddata="{() => (loaded = true)}"
		autoplay
		muted
		bind:paused
		bind:currentTime
		disableremoteplayback
		x-webkit-airplay="deny"
		preload="metadata"
		poster="{thumbnail}"
		class="object-fit absolute z-[3] h-full w-full"></video>
	<!-- svelte-ignore a11y-media-has-caption -->
	<video
		on:click="{handleClick}"
		bind:this="{videoBgEl}"
		loop
		playsinline
		disableremoteplayback
		autoplay
		muted
		paused="{paused}"
		poster="{thumbnail}"
		preload="metadata"
		x-webkit-airplay="deny"
		class="absolute inset-0 z-[1] h-full w-full origin-center object-cover blur-xl">
	</video>
	{#if (videoEl?.muted || $playerState.muted) && !paused && inView}
		<div class="fade-in max-w-16 pointer-events-none absolute inset-0 z-[5]">
			<div class="flex h-full items-center justify-center">
				<IconButton ariaLabel="Unmute this video">
					<SoundIcon class="breathe h-16 w-16 text-white/90 drop-shadow-lg" />
				</IconButton>
			</div>
		</div>
	{/if}

	<div
		style="background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 10%, rgba(0,0,0,0.8) 100%);"
		class="fade-in pointer-events-none absolute bottom-0 z-[10] block h-64 w-full">
		<div class="absolute bottom-16 bg-black">SHAKA {hls? 'HLS' : 'DASH'}</div>
	</div>
</player>

{#if !loaded}
	<loader
		class="max-w-16 fade-in pointer-events-none absolute inset-0 z-[5] flex items-center justify-center">
		<LoadingIcon class="h-36 w-36 animate-spin-slow text-primary" />
	</loader>
{/if}
