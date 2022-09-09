<script lang="ts">
import Button from '$components/button/Button.svelte';
import IconButton from '$components/button/IconButton.svelte';
import CaretLeftIcon from '$components/icons/CaretLeftIcon.svelte';
import PlayIcon from '$components/icons/PlayIcon.svelte';
import Input from '$components/input/Input.svelte';
import InputBox from '$components/input/InputBox.svelte';
import UploadLayout from '$components/layout/UploadLayout.svelte';
import { tweened } from 'svelte/motion';
import { cubicInOut } from 'svelte/easing';
import UploadStep from '$components/upload/UploadStep.svelte';
import { onMount, onDestroy } from 'svelte';
import { fileToUpload } from '$stores/fileUpload';
import { goto, prefetch } from '$app/navigation';
import { auth } from '$stores/auth';
import type { UploadStatus } from '$components/upload/UploadTypes';
import { checkVideoStatus, uploadVideoToStream, type CheckVideoStatusResult } from '$lib/stream';
import Log from '$lib/Log';

let uploadStatus: UploadStatus = 'to-upload';
let previewPaused = true;
const uploadProgress = tweened(0, {
	duration: 500,
	easing: cubicInOut
});
let videoEl: HTMLVideoElement;
let videoWidth = 0;
let videoHeight = 0;
let videoDescription = '';
let videoHashtags = '';
let descriptionError = '';
let hashtagError = '';
let uploadStep: 'uploading' | 'processing' | 'verified' | 'not-verified' = 'uploading';
let hashtags: string[] = [];
let videoStatusInterval: any;
let isInputLimitReached = false;
const MAX_HASHTAG_LENGTH = 60;
let videoSrc = '';
let previewMuted = true;

$: isInputLimitReached = videoHashtags.length >= MAX_HASHTAG_LENGTH;

async function nextStep() {
	descriptionError = hashtagError = '';
	if (uploadStatus === 'to-upload') {
		if (!videoDescription) {
			descriptionError = 'Description is required';
		} else if (videoDescription.length < 10) {
			descriptionError = 'Description is too short';
		}
		if (!hashtags.length) {
			hashtagError = 'Please add atleast 1 hashtag';
		}
		if (hashtagError || descriptionError) return;
		if (!$auth.isLoggedIn) {
			$auth.showLogin = true;
			return;
		}
		startUploading();
	}
}

async function updateHashtags() {
	hashtags = videoHashtags
		.split(/(?:,| )+/)
		.filter((o) => !!o)
		.map((o) => o.replace('#', '').toLowerCase());
}

async function startUploading() {
	if (!$fileToUpload) return;
	hashtagError = '';
	uploadStep = 'uploading';
	uploadStatus = 'uploading';
	const uploadRes: any = await uploadVideoToStream($fileToUpload, onProgress);
	Log({ uploadRes, source: '0 startUploading' }, 'info');
	if (!uploadRes.success) {
		Log({ error: uploadRes.error, source: '1 startUploading' }, 'error');
		hashtagError = 'Uploading failed. Please try again';
		uploadStatus = 'to-upload';
		uploadProgress.set(0);
		return;
	} else if (uploadRes.uid) {
		checkVideoProcessingStatus(uploadRes.uid);
	}
}

function onProgress(progress: number) {
	uploadProgress.set(progress * 100);
}

async function checkVideoProcessingStatus(uid: string) {
	uploadStep = 'processing';
	uploadProgress.set(100);
	videoStatusInterval = setInterval(async () => {
		try {
			const videoStatus = await checkVideoStatus(uid);
			Log({ videoStatus, source: '0 checkVideoProcessingStatus' }, 'info');
			if (videoStatus.success && videoStatus.result.readyToStream) {
				handleSuccessfulUpload(videoStatus.result);
				clearInterval(videoStatusInterval);
			} else throw new Error();
		} catch (_) {
			Log({ error: 'Processing error', source: '1 checkVideoProcessingStatus' }, 'error');
			console.error('Processing error');
			hashtagError = 'Uploading failed. Please try again';
			uploadStatus = 'to-upload';
			uploadProgress.set(0);
			return;
		}
	}, 4000);
}

async function handleSuccessfulUpload(result: CheckVideoStatusResult) {
	try {
		Log({ result, source: '0 handleSuccessfulUpload' }, 'info');
		// const postId = individualUser().create_post({
		// 	description: videoDescription,
		// 	hashtags: hashtags,
		// 	video_url: ''
		// });
		uploadStep = 'verified';
		uploadStatus = 'uploaded';
		// prefetch(`/all/${postId}`); //prefetch the newly uploaded video page
	} catch (_) {
		Log({ error: 'Couldnt send details to backend', source: '1 handleSuccessfulUpload' }, 'error');
		console.error('Couldnt send details to backend');
		hashtagError = 'Uploading failed. Please try again';
		uploadStatus = 'to-upload';
		uploadProgress.set(0);
		return;
	}
}

async function showShareDialog() {
	try {
		if (!navigator.canShare) {
			console.error('Browser does not support share dialog');
			return;
		}
		await navigator.share({
			title: 'Hot or Not',
			text: 'Video title',
			url: 'https://v2.gobazzinga.io/all/1'
		});
	} catch (err) {
		console.error('Cannot open share dialog', err);
	}
}

onMount(async () => {
	if ($fileToUpload) {
		videoSrc = URL.createObjectURL($fileToUpload);
	} else goto('/upload');
});

onDestroy(() => {
	$fileToUpload = null;
	videoEl?.pause();
	videoEl?.load();
	videoStatusInterval && clearInterval(videoStatusInterval);
});
</script>

<UploadLayout>
	<div slot="top-left">
		<IconButton href="/upload" prefetch>
			<CaretLeftIcon class="h-7 w-7 text-white" />
		</IconButton>
	</div>
	<svelte:fragment slot="top-center">Upload</svelte:fragment>
	<div
		slot="content"
		class="flex w-full flex-col items-center justify-start space-y-8 overflow-hidden overflow-y-scroll px-4 pt-10 lg:px-8"
	>
		<div
			style="{videoWidth && videoHeight ? `aspect-ratio: ${videoWidth}/${videoHeight}` : ''}"
			class="relative flex max-h-64 max-w-lg items-center justify-center"
		>
			{#if videoSrc}
				<!-- svelte-ignore a11y-media-has-caption -->
				<video
					preload="metadata"
					bind:this="{videoEl}"
					on:click="{() => {
						previewPaused = !previewPaused;
						previewMuted = false;
					}}"
					bind:paused="{previewPaused}"
					bind:videoHeight
					bind:videoWidth
					src="{videoSrc}"
					playsinline
					autoplay
					muted="{previewMuted}"
					class="h-full w-full rounded-xl bg-white/10 ring-4 ring-white/30"
				>
				</video>
			{/if}
			{#if previewPaused}
				<div
					on:click="{() => (previewPaused = false)}"
					class="absolute inset-0 flex items-center justify-center"
				>
					<IconButton class="rounded-full bg-black/50 p-4">
						<PlayIcon class="h-4 w-4" />
					</IconButton>
				</div>
			{/if}
		</div>
		{#if uploadStatus === 'to-upload'}
			<InputBox
				placeholder="Write your description here ..."
				bind:value="{videoDescription}"
				on:focus="{() => console.log('focus')}"
				on:blur="{() => console.log('blur')}"
				class="shrink-0 rounded-xl bg-white/10"
			/>
			{#if descriptionError}
				<div class="text-xs text-red-500">{descriptionError}</div>
			{/if}
			<div class="flex w-full flex-col space-y-2">
				<span class="text-white/60">Add Hashtags</span>
				<Input
					on:input="{updateHashtags}"
					bind:value="{videoHashtags}"
					type="text"
					maxlength="{MAX_HASHTAG_LENGTH}"
					placeholder="#hastag, #hastag2, #hastag3 ..."
					class="w-full rounded-xl bg-white/10"
				/>
				{#if hashtags.length}
					<div class="flex w-full flex-wrap items-center gap-2">
						{#each hashtags as hashtag}
							<div class="rounded-sm bg-primary/30 px-2 py-1 text-xs text-primary">#{hashtag}</div>
						{/each}
					</div>
				{/if}
			</div>
			{#if isInputLimitReached}
				<div class="text-xs text-red-500">Maximum hastags limit reached</div>
			{/if}
			{#if hashtagError}
				<div class="text-xs text-red-500">{hashtagError}</div>
			{/if}
		{:else}
			<div class="flex w-full flex-col space-y-10">
				<div class="flex w-full items-start space-x-4">
					<UploadStep step="{1}" status="{uploadStep === 'uploading' ? 'active' : 'finished'}" />
					<div class="flex w-full flex-col space-y-2">
						<span class="text-lg">Upload Progress</span>
						<div class="relative mt-2 h-2 w-full overflow-hidden rounded-full bg-white/20">
							<div style="width:{$uploadProgress}%" class="h-full rounded-full bg-primary"></div>
						</div>
						<span class="text-white/60">{Math.ceil($uploadProgress)}% video is uploaded</span>
					</div>
				</div>
				<div class="flex w-full items-start space-x-4">
					<UploadStep
						step="{2}"
						status="{uploadStep === 'uploading'
							? 'queued'
							: uploadStep === 'processing'
							? 'active'
							: 'finished'}"
					/>
					<div class="flex w-full flex-col space-y-2">
						<span class="text-lg">Processing Checks</span>
						{#if uploadStep === 'processing' || uploadStep == 'verified'}
							<span class="text-white/60">
								Before you publish we'll check your video for issues that may restrict it's
								visibility and other quality checks. We'll notify you when it's done
							</span>
						{/if}
					</div>
				</div>
				<div class="flex w-full items-start space-x-4">
					<UploadStep step="{3}" status="{uploadStep === 'verified' ? 'finished' : 'queued'}" />
					<div class="flex w-full flex-col space-y-2">
						<span class="text-lg">Final Verification</span>
						{#if uploadStep === 'verified'}
							<span class="text-white/60"> Your video has passed all the checks. </span>
						{/if}
					</div>
				</div>
			</div>
		{/if}
		<div class="pt-16 pb-24 shadow-up shadow-black/50">
			<div class="pb-4">
				<span class="text-primary"> Note: </span> Once the video is uploaded on the server it can't be
				deleted.
			</div>
			{#if uploadStatus === 'to-upload'}
				<Button class="w-full" on:click="{nextStep}">Upload Video</Button>
			{:else if uploadStatus === 'uploading'}
				<Button class="w-full" disabled on:click="{nextStep}">Uploading</Button>
			{:else if uploadStatus === 'uploaded'}
				<div class="flex items-center justify-between space-x-4">
					<Button on:click="{showShareDialog}" type="secondary" class="w-full">Share Video</Button>
					<Button href="/all" prefetch class="w-full">View Video</Button>
				</div>
			{/if}
		</div>
	</div>
</UploadLayout>
