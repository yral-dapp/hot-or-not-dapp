<script lang="ts" context="module">
export type UploadStatus = 'to-upload' | 'uploading' | 'uploaded';
</script>

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

let uploadStatus: UploadStatus = 'uploaded';
let previewPaused = true;
let uploadVideoUrl =
	'https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4';
const uploadProgress = tweened(5, {
	duration: 200,
	easing: cubicInOut
});

async function showShareDialog() {
	try {
		if (!navigator.canShare) {
			console.error('Browser does not support share dialog');
			return;
		}
		await navigator.share({
			title: 'Hot or Not',
			text: 'Video title',
			url: 'https://v2.gobazzinga.io/all/2'
		});
	} catch (err) {
		console.error('Cannot open share dialog', err);
	}
}
</script>

<UploadLayout>
	<div slot="top-left">
		<IconButton href="/upload" class="m-4">
			<CaretLeftIcon class="h-6 w-6 text-white" />
		</IconButton>
	</div>
	<svelte:fragment slot="top-center">Upload</svelte:fragment>
	<div
		slot="content"
		class="mb-40 flex h-full w-full flex-col items-center justify-start space-y-8 overflow-y-scroll py-10 px-8"
	>
		<div class="h-max-64 relative max-w-lg">
			<video
				on:click="{() => (previewPaused = true)}"
				bind:paused="{previewPaused}"
				class="h-64 w-full rounded-xl"
				src="{uploadVideoUrl}"
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
				rows="{6}"
				class="rounded-xl bg-white/10"
			/>
			<div class="flex w-full flex-col space-y-2">
				<span class="text-white/60">Add Hashtags</span>
				<Input
					type="text"
					placeholder="#hastag, #hastag2, #hastag3 ..."
					class="w-full rounded-xl bg-white/10"
				/>
			</div>
		{:else}
			<div class="flex w-full flex-col space-y-10">
				<div class="flex w-full items-start space-x-4">
					<UploadStep step="{1}" status="active" />
					<div class="flex w-full flex-col space-y-2">
						<span class="text-lg">Upload Progress</span>
						<div class="relative mt-2 h-2 w-full overflow-hidden rounded-full bg-white/20">
							<div style="width:{$uploadProgress}%" class="h-full rounded-full bg-primary"></div>
						</div>
						<span class="text-white/60">33% video is uploaded</span>
					</div>
				</div>
				<div class="flex w-full items-start space-x-4">
					<UploadStep step="{2}" status="queued" />
					<div class="flex w-full flex-col space-y-2">
						<span class="text-lg">Processing Checks</span>
						<span class="text-white/60">
							Before you publish we'll check your video for issues that may restrict it's visibility
							and other quality checks. We'll notify you when it's done
						</span>
					</div>
				</div>
				<div class="flex w-full items-start space-x-4">
					<UploadStep step="{3}" status="finished" />
					<div class="flex w-full flex-col space-y-2">
						<span class="text-lg">Final Verification</span>
						<span class="text-white/60"> Your video has passed all the checks. </span>
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
			<Button class="w-full" on:click="{() => (uploadStatus = 'uploaded')}">Upload Video</Button>
		{:else if uploadStatus === 'uploading'}
			<Button class="w-full">Continue Browsing</Button>
		{:else if uploadStatus === 'uploaded'}
			<div class="flex items-center justify-between space-x-4">
				<Button on:click="{showShareDialog}" type="secondary" class="w-full">Share Video</Button>
				<Button href="#" class="w-full">View Video</Button>
			</div>
		{/if}
	</div>
</UploadLayout>
