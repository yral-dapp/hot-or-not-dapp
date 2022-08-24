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

import { gcsBucket, uploadToBucketResumable } from '$lib/firebase';
import type { StorageError, UploadTask, UploadTaskSnapshot } from 'firebase/storage';
import type { UploadStatus } from './UploadTypes';

export let selectedFile: File | Blob | null = null;

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

async function nextStep() {
	descriptionError = hashtagError = '';
	if (uploadStatus === 'to-upload') {
		if (!videoDescription) {
			descriptionError = 'Description is required';
		} else if (videoDescription.length < 10) {
			descriptionError = 'Description is too short';
		}
		if (!videoHashtags) {
			hashtagError = 'Please add atleast 1 hashtag';
		}
		if (hashtagError || descriptionError) return;
		uploadStatus = 'uploading';
		startUploading();
	}
}

async function startUploading() {
	if (!selectedFile) return;
	const uploadRes = await uploadToBucketResumable(selectedFile);

	if (uploadRes.status === 'error') {
		handleUploadError(uploadRes.error);
		return;
	}

	uploadRes.uploadTask.on('state_changed', handleUploadProgress, handleUploadError, () =>
		handleUploadSuccess(uploadRes.uploadTask)
	);
}

async function handleUploadSuccess(uploadTask: UploadTask) {
	console.log('gcsUri', gcsBucket + uploadTask.snapshot.ref.fullPath);
	uploadStep = 'processing';
	setTimeout(() => {
		uploadStep = 'verified';
		uploadStatus = 'uploaded';
	}, 2000);
}

async function handleUploadError(error: StorageError | string) {
	console.error(error);
}

async function handleUploadProgress(snapshot: UploadTaskSnapshot) {
	const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
	uploadProgress.set(Math.ceil(progress));
	switch (snapshot.state) {
		case 'paused':
			console.log('Upload is paused');
			break;
		case 'running':
			console.log('Upload is running');
			break;
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
			url: 'https://v2.gobazzinga.io/all?id=2'
		});
	} catch (err) {
		console.error('Cannot open share dialog', err);
	}
}
onMount(async () => {
	if (selectedFile) {
		videoEl.src = URL.createObjectURL(selectedFile) + '#t=0.01';
	}
});

onDestroy(() => {
	videoEl.pause();
	videoEl.load();
});
</script>

<UploadLayout>
	<div slot="top-left">
		<IconButton on:click="{() => (selectedFile = null)}">
			<CaretLeftIcon class="h-7 w-7 text-white" />
		</IconButton>
	</div>
	<svelte:fragment slot="top-center">Upload</svelte:fragment>
	<div
		slot="content"
		class="mb-40 flex w-full flex-col items-center justify-start space-y-8 overflow-y-scroll py-10 px-4 lg:px-8"
	>
		<div
			style="{videoWidth && videoHeight ? `aspect-ratio: ${videoWidth}/${videoHeight}` : ''}"
			class="relative flex max-h-64 max-w-lg items-center justify-center"
		>
			<video
				preload="metadata"
				bind:this="{videoEl}"
				on:click="{() => (previewPaused = true)}"
				bind:paused="{previewPaused}"
				bind:videoHeight
				bind:videoWidth
				playsinline
				class="h-full w-full rounded-xl"
			>
				<track kind="captions" />
			</video>
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
				class="shrink-0 rounded-xl bg-white/10"
			/>
			{#if descriptionError}
				<div class="text-xs text-red-500">{descriptionError}</div>
			{/if}
			<div class="flex w-full flex-col space-y-2">
				<span class="text-white/60">Add Hashtags</span>
				<Input
					bind:value="{videoHashtags}"
					type="text"
					placeholder="#hastag, #hastag2, #hastag3 ..."
					class="w-full rounded-xl bg-white/10"
				/>
			</div>
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
	</div>
	<div slot="bottom" class="border-t-2 border-white/10 bg-black px-8">
		<div class="py-4">
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
				<Button href="#" class="w-full">View Video</Button>
			</div>
		{/if}
	</div>
</UploadLayout>
