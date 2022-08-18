<script lang="ts">
import Button from '$components/button/Button.svelte';
import IconButton from '$components/button/IconButton.svelte';
import CaretLeftIcon from '$components/icons/CaretLeftIcon.svelte';
import PlayIcon from '$components/icons/PlayIcon.svelte';
import Input from '$components/input/Input.svelte';
import InputBox from '$components/input/InputBox.svelte';
import UploadLayout from '$components/layout/UploadLayout.svelte';

let uploadState: 'to-upload' | 'uploading' | 'uploaded' = 'to-upload';
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
		class="mt-8 flex h-full w-full flex-col items-center justify-start space-y-8 overflow-auto px-8"
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
			<div class="flex w-full flex-col space-y-2">
				<div class="flex w-full items-center space-x-4">
					<div class="flex h-6 w-6 items-center justify-center rounded-full border-2 text-xs">
						1
					</div>
					<span>Upload Progress</span>
				</div>
				<div>Dance India Dance</div>
				<div class="h-2 w-full rounded-full bg-white/20"></div>
			</div>
		{/if}
	</div>
	<div slot="bottom" class="px-8">
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
