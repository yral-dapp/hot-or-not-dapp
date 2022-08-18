<script lang="ts">
import Button from '$components/button/Button.svelte';
import IconButton from '$components/button/IconButton.svelte';
import CaretLeftIcon from '$components/icons/CaretLeftIcon.svelte';
import PlayIcon from '$components/icons/PlayIcon.svelte';
import Input from '$components/input/Input.svelte';
import InputBox from '$components/input/InputBox.svelte';
import UploadLayout from '$components/layout/UploadLayout.svelte';

let uploadState: 'to-upload' | 'uploading' | 'uploaded' = 'uploading';
let previewPaused = true;
</script>

<UploadLayout>
	<div slot="top-left">
		<IconButton href="/upload" class="m-4">
			<CaretLeftIcon class="h-6 w-6 text-white" />
		</IconButton>
	</div>
	<div slot="top-center" class="mt-5">Upload</div>
	<div
		slot="content"
		class="mb-40 mt-6 flex h-full w-full flex-col items-center justify-start space-y-8 overflow-y-scroll py-10 px-8"
	>
		<div class="h-max-64 relative max-w-lg">
			<video
				on:click="{() => (previewPaused = true)}"
				bind:paused="{previewPaused}"
				class="w-full rounded-xl"
				src="https://assets.mixkit.co/videos/preview/mixkit-gummy-bears-lined-up-on-a-white-background-30382-large.mp4"
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
		{#if uploadState === 'to-upload'}
			<InputBox
				placeholder="Write your description here ..."
				rows="{6}"
				class="rounded-xl bg-white/10"
			/>
			<div class="flex w-full flex-col space-y-2">
				<span class="text-white/60">Add Hashtags</span>
				<Input
					type="text"
					placeholder="#Hastag, #Hastag2, #Hastag3 ..."
					class="w-full rounded-xl bg-white/10"
				/>
			</div>
		{:else if uploadState === 'uploading'}
			<div class="flex w-full flex-col space-y-10">
				<div class="flex w-full items-start space-x-4">
					<div
						class="-mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2"
					>
						1
					</div>
					<div class="flex w-full flex-col space-y-2">
						<span class="text-lg">Upload Progress</span>
						<span class="pt-1">Dance India Dance</span>
						<div class="mt-2 h-2 w-full rounded-full bg-white/20"></div>
						<span class="text-white/60">33% video is uploaded</span>
					</div>
				</div>
				<div class="flex w-full items-start space-x-4">
					<div
						class="-mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2"
					>
						2
					</div>
					<div class="flex w-full flex-col space-y-2">
						<span class="text-lg">Processing Checks</span>
						<span class="text-white/60">
							Before you publish we'll check your video for issues that may restrict it's visibility
							and other quality checks. We'll notify you when it's done
						</span>
					</div>
				</div>
				<div class="flex w-full items-start space-x-4">
					<div
						class="-mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2"
					>
						3
					</div>
					<div class="flex w-full flex-col space-y-2">
						<span class="text-lg">Final Verification</span>
						<span class="text-white/60">
							Before you publish we'll check your video for issues that may restrict it's visibility
							and other quality checks. We'll notify you when it's done
						</span>
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
		{#if uploadState === 'to-upload'}
			<Button class="w-full" on:click="{() => (uploadState = 'uploading')}">Upload Video</Button>
		{:else if uploadState === 'uploading'}
			<Button class="w-full">Continue Browsing</Button>
		{:else if uploadState === 'uploaded'}
			<div class="flex items-center justify-between space-x-4">
				<Button type="secondary" class="w-full">Share Video</Button>
				<Button class="w-full">View Video</Button>
			</div>
		{/if}
	</div>
</UploadLayout>
