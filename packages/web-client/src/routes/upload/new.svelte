<script lang="ts">
import Button from '$components/button/Button.svelte';
import IconButton from '$components/button/IconButton.svelte';
import CaretLeftIcon from '$components/icons/CaretLeftIcon.svelte';
import UploadLayout from '$components/layout/UploadLayout.svelte';

let uploadState: 'to-upload' | 'uploading' | 'uploaded' = 'to-upload';
</script>

<UploadLayout>
	<div slot="top-left">
		<IconButton>
			<CaretLeftIcon class="h-6 w-6 text-white" />
		</IconButton>
	</div>
	<div slot="top-center">Upload</div>
	<div slot="content" class="h-full w-full flex-col overflow-auto"></div>
	<div slot="bottom" class="px-8">
		{#if uploadState === 'to-upload'}
			<Button class="w-full">Upload Video</Button>
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
