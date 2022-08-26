<script lang="ts">
import Avatar from '$components/avatar/Avatar.svelte';
import IconButton from '$components/button/IconButton.svelte';
import EyeIcon from '$components/icons/EyeIcon.svelte';
import FireIcon from '$components/icons/FireIcon.svelte';
import HeartIcon from '$components/icons/HeartIcon.svelte';
import ShareMessageIcon from '$components/icons/ShareMessageIcon.svelte';
import { fade } from 'svelte/transition';
import { playerState } from '$stores/playerState';
import SoundIcon from '$components/icons/SoundIcon.svelte';
import { goto } from '$app/navigation';
import LoadingIcon from '$components/icons/LoadingIcon.svelte';
import placeholderImage from '$assets/placeholder.png';

export let src = '';
export let i: number;
export let thumbnail = '';
export let load = false;
export let autoplay = false;
export let userName = 'Natasha';
export let videoViews = 254000;

// let generatedThumbnail = '';
// let loadThumbnail = false;
let videoEl: HTMLVideoElement;
let videoBgEl: HTMLVideoElement;
let loaded = false;

export async function play() {
	if (videoEl) {
		videoEl.currentTime = 0;
		videoBgEl.currentTime = 0;
		videoEl.play();
		videoBgEl.play();
	}
}

export async function stop() {
	if (videoEl && videoBgEl) {
		videoEl.currentTime = 0;
		videoBgEl.currentTime = 0;
		videoEl.pause();
		videoBgEl.pause();
	}
}
</script>

<player
	i="{i}"
	on:click="{() => ($playerState.muted = !$playerState.muted)}"
	class="relative flex h-full w-full items-center justify-center transition-all duration-500 {autoplay &&
	loaded
		? 'opacity-100'
		: 'opacity-0'}"
>
	{#if load}
		<!-- svelte-ignore a11y-media-has-caption -->
		<video
			bind:this="{videoEl}"
			loop
			playsinline
			on:loadeddata="{() => {
				console.log('loaded', i);
				loaded = true;
			}}"
			autoplay="{!$playerState.initialized}"
			muted="{$playerState.muted || !autoplay}"
			disableremoteplayback
			x-webkit-airplay="deny"
			preload="metadata"
			src="{src}"
			poster="{thumbnail}"
			class="object-fit absolute z-[3] h-full w-full"></video>
		<!-- svelte-ignore a11y-media-has-caption -->
		<video
			bind:this="{videoBgEl}"
			loop
			playsinline
			disableremoteplayback
			muted
			autoplay="{i == 0}"
			preload="metadata"
			x-webkit-airplay="deny"
			class="absolute inset-0 z-[1] h-full w-full origin-center object-cover blur-md"
			src="{src}"
		>
		</video>
	{/if}

	{#if $playerState.muted}
		<div
			transition:fade="{{ duration: 100 }}"
			class="max-w-16 pointer-events-none absolute inset-0 z-[5]"
		>
			<div class="flex h-full items-center justify-center">
				<IconButton>
					<SoundIcon class="breathe h-16 w-16 text-white/90 drop-shadow-lg" />
				</IconButton>
			</div>
		</div>
	{/if}

	<div class="max-w-16 absolute right-4 bottom-20 z-[5]">
		<div class="flex flex-col space-y-6">
			<IconButton>
				<HeartIcon class="h-8 w-8" />
			</IconButton>
			<IconButton>
				<ShareMessageIcon class="h-6 w-6" />
			</IconButton>
			<IconButton
				class="rounded-full border-[0.15rem] border-[#FA9301] bg-gradient-to-b from-[#F63700] to-[#FFC848] p-2"
			>
				<FireIcon class="h-5 w-5" />
			</IconButton>
		</div>
	</div>

	<div class="absolute inset-x-0 bottom-20 left-4 right-16 z-[5] w-min">
		<div
			on:click="{(e) => e.stopImmediatePropagation()}"
			class="pointer-events-auto flex space-x-3"
		>
			<button on:click="{() => goto('/profile/2')}" class="h-12 w-12">
				<Avatar class="h-12 w-12" src="{placeholderImage}" />
			</button>
			<div class="flex flex-col space-y-1">
				<button on:click="{() => goto('/profile/2')}">{userName}</button>
				<div class="flex items-center space-x-1">
					<EyeIcon class="h-4 w-4 text-white" />
					<span class="text-sm">{videoViews}</span>
				</div>
			</div>
		</div>
	</div>
</player>
{#if !loaded}
	<loader
		transition:fade|local="{{ duration: 300 }}"
		class="max-w-16 pointer-events-none absolute inset-0 z-[5] flex items-center justify-center"
	>
		<LoadingIcon class="h-36 w-36 animate-spin-slow text-primary" />
	</loader>
{/if}
