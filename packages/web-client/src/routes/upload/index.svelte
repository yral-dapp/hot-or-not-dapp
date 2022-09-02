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
	getMediaStream
} from '$lib/cameraPermissions';
import { onMount, tick, onDestroy } from 'svelte';
import { fade } from 'svelte/transition';
import c from 'clsx';
import { allFilters, getFilterCss } from '$lib/filtersMap';
import { debounce } from 'throttle-debounce';
import { fileToUpload } from '$stores/fileUpload';
import { goto, prefetch } from '$app/navigation';
import { isiPhone } from '$lib/isSafari';
import type { CameraControls } from '$components/upload/UploadTypes';
import LoadingIcon from '$components/icons/LoadingIcon.svelte';
import Popup from '$components/popup/Popup.svelte';
import Button from '$components/button/Button.svelte';
import { linear } from 'svelte/easing';
import { tweened, type Tweened } from 'svelte/motion';

let videoEl: HTMLVideoElement;
let mediaStream: MediaStream;
let inputEl: HTMLInputElement;
let initState: 'init' | 'denied' | 'allowed' = 'init';
let timerInterval: any = undefined;
let timerCountdown = 0;
let recordingProgress: Tweened<number> | undefined = tweened(0, {
	duration: 1000,
	easing: linear
});
let canvasEl: HTMLCanvasElement;
let cameraEl: HTMLElement;
let filtersEl: HTMLElement;
let selectedFilter: keyof typeof allFilters | 'clear' = 'clear';
let recordStream: MediaStream;
let mediaRecorder: MediaRecorder;
let recordedChunks: Blob[] = [];
let captureInterval: any;
let recording = false;
let useCanvas = false;
let loading = false;
let recordingInterval: any;
let recordingSeconds = 0;
let invalidFileSelected = {
	show: false,
	error: 'size'
};

const MAX_RECORDING_SECONDS = 20;
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

function checkFileSelected(files: FileList | null) {
	loading = true;
	if (files && files[0]) {
		if (files[0].size / 1024 / 1024 > 200) {
			//file is larger than 200 MiB
			invalidFileSelected = {
				show: true,
				error: 'size'
			};
			loading = false;
			return;
		}
		const videoEl = document.createElement('video');
		videoEl.preload = 'metadata';
		videoEl.onloadedmetadata = () => {
			URL.revokeObjectURL(videoEl.src);
			if (videoEl.duration && videoEl.duration > 1) {
				if (videoEl.duration > 60) {
					invalidFileSelected = {
						show: true,
						error: 'length'
					};
					loading = false;
				} else {
					console.log('file is fine', files);
					$fileToUpload = files[0];
					goto('/upload/new');
				}
			} else {
				invalidFileSelected = {
					show: true,
					error: 'other'
				};
				loading = false;
			}
		};
		videoEl.src = URL.createObjectURL(files[0]);
	}
}

function toggleTimer() {
	if (cameraControls.timer === 'off') cameraControls.timer = '5s';
	else if (cameraControls.timer === '5s') cameraControls.timer = '10s';
	else cameraControls.timer = 'off';
}

async function switchCamera() {
	cameraControls.flip.facingMode =
		cameraControls.flip.facingMode === 'user' ? 'environment' : 'user';
	if (cameraControls.flash !== 'not-available' && cameraControls.flash !== 'hide') {
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
		console.warn('flash not available on this device');
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
			startRecording(true);
		}
	}, 1000);
}

async function startRecording(ignoreTimer = false) {
	if (recording) {
		recording = false;
		clearInterval(recordingInterval);
		recordingProgress = undefined;
		await tick();
		mediaRecorder.stop();
	} else if (cameraControls.timer !== 'off' && !ignoreTimer) {
		timerCountdown = cameraControls.timer === '5s' ? 5 : 10;
		setTimer();
	} else {
		console.log('starting recoridng');
		if (useCanvas) {
			recordStream = canvasEl.captureStream(30);
		} else recordStream = mediaStream;
		const mimeType = MediaRecorder.isTypeSupported('video/webm; codecs=vp9')
			? 'video/webm; codecs=vp9'
			: 'video/mp4;';
		mediaRecorder = new MediaRecorder(recordStream, { mimeType });
		mediaRecorder.ondataavailable = handleDataAvailable;
		recordingInterval = setInterval(() => {
			if (recordingSeconds < MAX_RECORDING_SECONDS) {
				recordingSeconds++;
				recordingProgress?.set((recordingSeconds / MAX_RECORDING_SECONDS) * 100);
			} else {
				startRecording();
				clearInterval(recordingInterval);
			}
		}, 1000);
		mediaRecorder.start();
		recording = true;
	}
}

function handleDataAvailable(event: any) {
	console.log('data-available');
	if (event.data.size > 0) {
		loading = true;
		recordedChunks.push(event.data);
		const type = MediaRecorder.isTypeSupported('video/webm') ? 'video/webm' : 'video/mp4;';
		$fileToUpload = new Blob(recordedChunks, {
			type
		});
		goto('/upload/new');
	} else {
		console.log('else');
	}
}

function updateCanvas() {
	if (canvasEl && useCanvas) {
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

async function checkClickAndStartRecording(e: MouseEvent) {
	const captureArea = cameraEl.getBoundingClientRect();
	if (
		e.x > captureArea.left &&
		e.x < captureArea.right &&
		e.y > captureArea.top &&
		e.y < captureArea.bottom
	) {
		startRecording();
	}
}

function prefetchLinks() {
	prefetch('/all');
	prefetch('/upload/new');
}

onMount(async () => {
	await requestMediaAccess();
	useCanvas = !isiPhone();
	if (useCanvas) {
		await tick();
		updateCanvas();
		startCapturing();
	}
	prefetchLinks();
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
	recordingInterval && clearInterval(recordingInterval);
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
					playsinline
					style="{!useCanvas
						? cameraControls.flip.facingMode === 'user'
							? 'transform: scaleX(-1);'
							: ''
						: ''}"
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
				{#if useCanvas}
					<canvas class="absolute z-[5]" bind:this="{canvasEl}"></canvas>
				{/if}
			{/if}
		</div>
	</svelte:fragment>
	<div class="flex h-full w-full items-center justify-center space-x-16" slot="bottom-navigation">
		<button class="focus:outline-none" on:click="{() => inputEl.click()}">Gallery</button>
		<div class="relative">
			<button class="focus:outline-none">Camera</button>
			<div class="absolute inset-x-0 -bottom-2 h-0.5 w-full rounded-full bg-primary"></div>
		</div>
	</div>
	<div class="pointer-events-auto relative flex w-full items-start justify-end px-5" slot="top">
		{#if recording}
			<div class="absolute top-4 left-4 right-4 h-2 rounded-full bg-white px-5">
				<div
					style="width: {$recordingProgress}%"
					class="absolute top-0 left-0 h-full max-w-full rounded-full bg-primary"
				></div>
			</div>
		{:else}
			<IconButton href="/all" prefetch class="h-10 w-10 rounded-full bg-black/50">
				<CloseIcon class="h-6 w-6 text-white" />
			</IconButton>
		{/if}
	</div>
	<svelte:fragment slot="bottom-camera-controls">
		{#if initState == 'allowed'}
			<!-- Snap Point -->
			<div transition:fade class="flex items-end justify-start pt-7">
				<div
					bind:this="{cameraEl}"
					on:click="{() => !loading && startRecording()}"
					class="{c(
						'relative mx-auto flex h-14 w-14 select-none items-center justify-center rounded-full ring-8 ring-white/50 transition-all duration-300',
						recording ? 'z-[5] bg-red-500' : 'bg-white'
					)}"
				>
					<div class="h-4 w-4 rounded-sm bg-white"></div>
					{#if loading}
						<LoadingIcon class="absolute mx-auto h-8 w-8 animate-spin-slow text-primary" />
					{/if}
				</div>
			</div>
			{#if !recording && useCanvas}
				<div
					on:click="{(e) => !loading && checkClickAndStartRecording(e)}"
					transition:fade
					bind:this="{filtersEl}"
					on:scroll="{checkWhichEl}"
					class="hide-scrollbar absolute bottom-4 -mt-20 flex w-full select-none snap-x snap-mandatory gap-6 overflow-x-auto "
				>
					<!-- Begin Dumb item -->
					<div data-filter="clear" class="shrink-0 snap-center">
						<div class="w-dumb-start shrink-0"></div>
					</div>
					<!-- End Dumb item -->
					{#each Object.keys(allFilters) as filter, i}
						<img
							draggable="false"
							data-filter="{filter}"
							style="filter: {getFilterCss(filter)}; -webkit-touch-callout: none;"
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
					{@const disabled = !cameraControls.flip.show || (recording && !useCanvas)}
					<div class="flex flex-col items-center justify-center space-y-1">
						<IconButton
							disabled="{disabled}"
							on:click="{switchCamera}"
							class="flex h-10 w-10 items-center justify-center rounded-full bg-black"
						>
							<FlipIcon disabled="{disabled}" class="h-4 w-4 text-white" />
						</IconButton>
						<span class="text-xs">Flip</span>
					</div>
				{/if}
				<div class="flex flex-col items-center justify-center space-y-1">
					<IconButton
						disabled="{recording}"
						on:click="{toggleTimer}"
						class="{c('flex h-10 w-10 items-center justify-center rounded-full', {
							'bg-black text-white': cameraControls.timer === 'off',
							'bg-white text-primary': cameraControls.timer !== 'off'
						})}"
					>
						{#if cameraControls.timer === 'off'}
							<TimerIcon disabled="{recording}" class="h-5 w-5 " />
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
	disabled="{loading || recording}"
	bind:this="{inputEl}"
	class="hidden"
	on:change="{(e) => checkFileSelected(e.currentTarget.files)}"
/>

<Popup on:close="{() => (inputEl.value = '')}" bind:show="{invalidFileSelected.show}">
	<div class="flex flex-col space-y-4">
		<div>
			{#if invalidFileSelected.error === 'size'}
				The video you selected is larger than 200MB. Please select a smaller video
			{:else if invalidFileSelected.error === 'length'}
				The video you selected is longer than 1 minute. Please select a shorter video
			{:else}
				Something went wrong selecting the video. Please try again
			{/if}
		</div>
		<Button
			on:click="{() => {
				invalidFileSelected.show = false;
				inputEl.value = '';
			}}">Okay</Button
		>
	</div>
</Popup>

<style>
.w-dumb-start {
	width: calc((100vw / 2) + 2rem);
}

.w-dumb-end {
	width: calc((100vw / 2) - 3rem);
}
</style>
