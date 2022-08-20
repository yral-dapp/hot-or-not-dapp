<script lang="ts" context="module">
interface CameraControls {
	flash: 'on' | 'off' | 'not-available' | 'hide';
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
import { allFilters, getFilterCss } from '$lib/filtersMap';
import { debounce } from 'throttle-debounce';
import { fileList, fileBlob } from '$stores/fileUpload';
import { goto } from '$app/navigation';

let videoEl: HTMLVideoElement;
let mediaStream: MediaStream;
let inputEl: HTMLInputElement;
let initState: 'init' | 'denied' | 'allowed' = 'init';
let timerInterval: any = undefined;
let timerCountdown = 0;
let canvasEl: HTMLCanvasElement;
let cameraEl: HTMLElement;
let filtersEl: HTMLElement;
let selectedFilter: keyof typeof allFilters | 'clear' = 'clear';
let recordStream: MediaStream;
let mediaRecorder: MediaRecorder;
let recordedChunks: Blob[] = [];
let captureInterval: any;
let recording = false;

const filterPreviewImage =
	'https://images.unsplash.com/photo-1563982291479-585982ec57b6?w=320&q=80&fm=jpg&crop=entropy&cs=tinysrgb';

let cameraControls: CameraControls = {
	flash: 'off',
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
	$fileList = files;
	goto('/upload/new');
}

function toggleTimer() {
	if (cameraControls.timer === 'off') cameraControls.timer = '5s';
	else if (cameraControls.timer === '5s') cameraControls.timer = '10s';
	else cameraControls.timer = 'off';
}

async function switchCamera() {
	cameraControls.flip.facingMode =
		cameraControls.flip.facingMode === 'user' ? 'environment' : 'user';
	if (cameraControls.flash !== 'not-available') {
		await toggleTorch();
	}
	await requestMediaAccess();
}

async function toggleTorch() {
	const success = await applyConstraintsOnVideoStream(mediaStream, {
		//@ts-ignore
		advanced: [{ torch: cameraControls.flash === 'on' ? false : true }]
	});
	if (success) {
		cameraControls.flash = cameraControls.flash === 'on' ? 'off' : 'on';
	}
}

async function checkIfFlashAvailable() {
	try {
		//@ts-ignore
		const imageCapture = new ImageCapture(mediaStream.getVideoTracks()[0]);
		const capablities = await imageCapture.getPhotoCapabilities();
		cameraControls.flash = capablities.fillLightMode ? 'off' : 'not-available';
	} catch (e) {
		console.error('Flash not available');
		cameraControls.flash = 'hide';
	}
}

async function checkIfFlipAvailable() {
	const { videoDevices } = await getDevicesList();
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

async function startRecording(ignoreTimer: boolean = false) {
	if (recording) {
		mediaRecorder.stop();
		recording = false;
	} else if (cameraControls.timer !== 'off' && !ignoreTimer) {
		timerCountdown = cameraControls.timer === '5s' ? 5 : 10;
		setTimer();
	} else {
		console.log('starting recoridng');
		recordStream = canvasEl.captureStream(30);
		mediaRecorder = new MediaRecorder(recordStream, { mimeType: 'video/webm; codecs=vp9' });
		mediaRecorder.ondataavailable = handleDataAvailable;
		mediaRecorder.start();
		recording = true;
	}
}

function handleDataAvailable(event: any) {
	console.log('data-available');
	if (event.data.size > 0) {
		recordedChunks.push(event.data);
		console.log({ recordedChunks }, typeof recordedChunks);
		$fileBlob = new Blob(recordedChunks, {
			type: 'video/webm'
		});
		goto('/upload/new');
	} else {
		console.log('else');
	}
}

function updateCanvas() {
	if (canvasEl) {
		canvasEl.height = window.innerHeight;
		canvasEl.width = window.innerWidth;
	}
}

function computeFrame() {
	const ctx = canvasEl.getContext('2d');
	if (ctx) {
		ctx.drawImage(
			videoEl,
			0,
			0,
			window.innerWidth,
			window.innerHeight,
			0,
			0,
			window.innerWidth,
			window.innerHeight
		);
		const frame = ctx.getImageData(0, 0, canvasEl.width, canvasEl.height);
		if (selectedFilter != 'clear') ctx.filter = getFilterCss(selectedFilter);
		else ctx.filter = '';
		ctx.putImageData(frame, 0, 0);
	}
}

function startCapturing() {
	captureInterval = setInterval(computeFrame, 33.34); // 33.34ms is == 30 fps
}

const checkWhichEl = debounce(500, () => {
	const captureArea = cameraEl.getBoundingClientRect();
	for (let i = 0; i < filtersEl.children.length - 1; i++) {
		const filterEl = filtersEl.children[i].getBoundingClientRect();
		if (filterEl.left > captureArea.left && captureArea.right > filterEl.right) {
			const filterElSelected = filtersEl.children[i].getAttribute('data-filter');
			console.log({ filterElSelected });
			selectedFilter = filterElSelected ?? 'clear';
			break;
		}
	}
});

onMount(async () => {
	await requestMediaAccess();
	updateCanvas();
	startCapturing();
});

onDestroy(async () => {
	if (cameraControls.flash == 'on') {
		await toggleTorch();
	}
	if (mediaStream) {
		const tracks = mediaStream.getTracks();
		tracks.forEach((track) => track.stop());
	}
	captureInterval && clearInterval(captureInterval);
	timerInterval && clearInterval(timerInterval);
});
</script>

<svelte:window on:resize="{updateCanvas}" />

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
					on:play
					muted
					bind:this="{videoEl}"
					autoplay
					class="absolute z-[4] h-full w-full object-cover object-center"
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
				<canvas class="absolute z-[5]" bind:this="{canvasEl}"></canvas>
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
	<svelte:fragment slot="bottom-camera-controls">
		{#if initState == 'allowed'}
			<!-- Snap Point -->
			<div transition:fade class="flex items-end justify-start pt-7">
				<div
					bind:this="{cameraEl}"
					on:click="{() => startRecording()}"
					class="{c(
						'mx-auto flex h-14 w-14 items-center justify-center rounded-full outline outline-2 outline-offset-8 outline-white transition-all duration-300',
						recording ? 'z-[5] bg-red-500' : 'bg-white'
					)}"
				>
					<div class="h-4 w-4 rounded-sm bg-white"></div>
				</div>
			</div>
			{#if !recording}
				<div
					transition:fade
					bind:this="{filtersEl}"
					on:scroll="{checkWhichEl}"
					on:click="{(e) => e.stopImmediatePropagation()}"
					class="hide-scrollbar absolute bottom-4 -mt-20 flex w-full select-none snap-x snap-mandatory gap-6 overflow-x-auto "
				>
					<!-- Begin Dumb item -->
					<div data-filter="clear" class=" shrink-0 snap-center">
						<div class="w-dumb-start shrink-0"></div>
					</div>
					<!-- End Dumb item -->
					{#each Object.keys(allFilters) as filter, i}
						<img
							on:click="{() => selectedFilter == filter && startRecording()}"
							data-filter="{filter}"
							style="filter: {getFilterCss(filter)}"
							alt="{filter}"
							src="{filterPreviewImage}"
							class="h-12 w-12 shrink-0 select-none snap-center snap-always rounded-full"
						/>
					{/each}

					<div data-filter="clear" class="shrink-0 snap-center">
						<div class="w-dumb-end shrink-0"></div>
					</div>
				</div>
			{/if}
		{/if}
	</svelte:fragment>

	<div
		class="pointer-events-auto flex h-full select-none flex-col items-center justify-center"
		slot="right-camera-controls"
	>
		{#if initState == 'allowed'}
			<div class="flex flex-col space-y-6 rounded-full bg-black/50 p-3">
				{#if cameraControls.flash !== 'hide'}
					<div class="flex flex-col items-center justify-center space-y-1">
						<IconButton
							on:click="{toggleTorch}"
							disabled="{cameraControls.flash === 'not-available'}"
							class="{c(
								'flex h-10 w-10 items-center justify-center rounded-full',
								cameraControls.flash === 'on' ? 'bg-white text-primary' : 'bg-black text-white'
							)}"
						>
							<FlashIcon variant="{cameraControls.flash}" class="h-5 w-5" />
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

<style>
.w-dumb-start {
	width: calc((100vw / 2) + 2rem);
}

.w-dumb-end {
	width: calc((100vw / 2) - 3rem);
}
</style>
