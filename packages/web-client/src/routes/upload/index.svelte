<script lang="ts" context="module">
interface CameraControls {
	flash: {
		show: boolean;
		enabled: boolean;
	};
	flip: {
		facingMode: FacingMode;
		show: boolean;
	};
	timer: 'off' | '5s' | '10s';
}
</script>

<script lang="ts">
import IconButton from '$components/button/IconButton.svelte';
import CameraAccessIcon from '$components/icons/CameraAccessIcon.svelte';
import CloseIcon from '$components/icons/CloseIcon.svelte';
import FlashIcon from '$components/icons/FlashIcon.svelte';
import FlipIcon from '$components/icons/FlipIcon.svelte';
import TimerIcon from '$components/icons/TimerIcon.svelte';
import CameraLayout from '$components/layout/CameraLayout.svelte';
import {
	applyConstraintsOnVideoStream,
	getDevicesList,
	getMediaStream,
	type FacingMode
} from '$lib/cameraPermissions';
import { onMount, tick, onDestroy } from 'svelte';
import { fade } from 'svelte/transition';
import c from 'clsx';

let videoEl: HTMLVideoElement;
let mediaStream: MediaStream;
let inputEl: HTMLInputElement;
let initState: 'init' | 'denied' | 'allowed' = 'init';
let timerInterval: any = undefined;
let timerCountdown = 0;

let cameraControls: CameraControls = {
	flash: {
		show: false,
		enabled: false
	},
	flip: {
		show: false,
		facingMode: 'user'
	},
	timer: 'off'
};

$: mediaStream && updateVideoStream();

async function updateVideoStream() {
	initState = 'allowed';
	await tick();
	videoEl.srcObject = mediaStream;
}

function handleFileUpload(files: FileList | null) {
	console.log('file selected', files);
}

function toggleTimer() {
	if (cameraControls.timer === 'off') cameraControls.timer = '5s';
	else if (cameraControls.timer === '5s') cameraControls.timer = '10s';
	else cameraControls.timer = 'off';
}

async function switchCamera() {
	cameraControls.flip.facingMode =
		cameraControls.flip.facingMode === 'user' ? 'environment' : 'user';
	if (cameraControls.flash.enabled) {
		await toggleTorch();
	}
	await requestMediaAccess();
}

async function toggleTorch() {
	const success = await applyConstraintsOnVideoStream(mediaStream, {
		//@ts-ignore
		advanced: [{ torch: !cameraControls.flash.enabled }]
	});
	if (success) {
		cameraControls.flash.enabled = !cameraControls.flash.enabled;
	}
}

async function checkIfFlashAvailable() {
	//@ts-ignore
	const imageCapture = new ImageCapture(mediaStream.getVideoTracks()[0]);
	const capablities = await imageCapture.getPhotoCapabilities();
	cameraControls.flash.show = capablities.fillLightMode ? true : false;
}

async function checkIfFlipAvailable() {
	const { videoDevices } = await await getDevicesList();
	cameraControls.flip.show = videoDevices && videoDevices.length > 1 ? true : false;
}

async function requestMediaAccess() {
	if (mediaStream) {
		const tracks = mediaStream.getTracks();
		tracks.forEach((track) => track.stop());
	}
	const res = await getMediaStream(cameraControls.flip.facingMode);
	if (res.error == 'none' && res.stream) {
		mediaStream = res.stream;
		await checkIfFlashAvailable();
		await checkIfFlipAvailable();
	} else {
		initState = 'denied';
	}
}

function setTimer() {
	timerInterval = setInterval(() => {
		timerCountdown--;
		if (timerCountdown == 0) {
			clearInterval(timerInterval);
			timerInterval = undefined;
			startRecording(true);
		}
	}, 1000);
}

$: console.log({ timerCountdown, timerInterval });

async function startRecording(ignoreTimer: boolean = false) {
	if (cameraControls.timer !== 'off' && !ignoreTimer) {
		timerCountdown = cameraControls.timer === '5s' ? 5 : 10;
		setTimer();
	} else {
		console.log('start recording');
	}
}

onMount(async () => await requestMediaAccess());

onDestroy(async () => {
	if (cameraControls.flash.enabled) {
		await toggleTorch();
	}
});
</script>

<CameraLayout>
	<svelte:fragment slot="content">
		<div class="realtive h-full w-full bg-black">
			{#if initState != 'allowed'}
				<div
					transition:fade|local
					class="flex h-full flex-col items-center justify-center space-y-8 px-10"
				>
					<CameraAccessIcon class="h-56" />
					{#if initState == 'denied'}
						<span class="font-semibold">Enable Camera Access</span>
						<span class="text-center text-white/60">
							Please provide us access to your camera, whch is required for recording video
						</span>
					{/if}
				</div>
			{:else}
				<!-- svelte-ignore a11y-media-has-caption -->
				<video
					muted
					bind:this="{videoEl}"
					autoplay
					class="absolute z-[5] h-full w-full object-cover object-center"
				>
				</video>
				{#if timerInterval}
					{#key timerCountdown}
						<div
							in:fade|local="{{ duration: 500, delay: 100 }}"
							out:fade|local="{{ duration: 100 }}"
							class="{c(
								'absolute z-[6] flex h-full w-full items-center justify-center bg-transparent text-9xl font-bold',
								timerCountdown > 3 ? 'text-white' : 'text-primary'
							)}"
						>
							{timerCountdown}
						</div>
					{/key}
				{/if}
			{/if}
		</div>
	</svelte:fragment>
	<div class="flex h-full w-full items-center justify-center space-x-16" slot="bottom-navigation">
		<button class="focus:outline-none" on:click="{() => inputEl.click()}">Gallery</button>
		<button class="focus:outline-none">Camera</button>
	</div>
	<div class="pointer-events-auto flex w-full items-start justify-end px-5" slot="top">
		<IconButton href="/" class="h-10 w-10 rounded-full bg-black/50">
			<CloseIcon class="h-6 w-6 text-white" />
		</IconButton>
	</div>
	<div
		class="pointer-events-auto flex w-full items-center justify-center space-x-3 px-4 pb-6"
		slot="bottom-camera-controls"
	>
		{#if initState == 'allowed'}
			<div class="h-12 w-12 rounded-full bg-blue-200"></div>
			<div class="h-12 w-12 rounded-full bg-orange-200"></div>
			<button on:click="{() => startRecording()}" class="px-4">
				<div class="h-14 w-14 rounded-full bg-white ring-[0.8rem] ring-white/50"></div>
			</button>
			<div class="h-12 w-12 rounded-full bg-green-200"></div>
			<div class="h-12 w-12 rounded-full bg-pink-200"></div>
		{/if}
	</div>
	<div
		class="pointer-events-auto flex h-full select-none flex-col items-center justify-center"
		slot="right-camera-controls"
	>
		{#if initState == 'allowed'}
			<div class="flex flex-col space-y-6 rounded-full bg-black/50 p-3">
				{#if cameraControls.flash.show}
					<div class="flex flex-col items-center justify-center space-y-1">
						<IconButton
							on:click="{toggleTorch}"
							class="flex h-10 w-10 items-center justify-center rounded-full bg-black"
						>
							<FlashIcon class="h-5 w-5 text-white" />
						</IconButton>
						<span class="text-xs">Flash</span>
					</div>
				{/if}

				{#if cameraControls.flip.show}
					<div class="flex flex-col items-center justify-center space-y-1">
						<IconButton
							on:click="{switchCamera}"
							class="flex h-10 w-10 items-center justify-center rounded-full bg-black"
						>
							<FlipIcon class="h-5 w-5 text-white" />
						</IconButton>
						<span class="text-xs">Flip</span>
					</div>
				{/if}
				<div class="flex flex-col items-center justify-center space-y-1">
					<IconButton
						on:click="{toggleTimer}"
						class="{c('flex h-10 w-10 items-center justify-center rounded-full', {
							'bg-black text-white': cameraControls.timer === 'off',
							'bg-white text-primary': cameraControls.timer !== 'off'
						})}"
					>
						{#if cameraControls.timer === 'off'}
							<TimerIcon class="h-6 w-6 " />
						{:else}
							{cameraControls.timer}
						{/if}
					</IconButton>
					<span class="text-xs">Timer</span>
				</div>
			</div>
		{/if}
	</div>
</CameraLayout>

<input
	type="file"
	accept="video/*"
	bind:this="{inputEl}"
	class="hidden"
	on:change="{(e) => handleFileUpload(e.currentTarget.files)}"
/>
