<script lang="ts">
import IconButton from '$components/button/IconButton.svelte';
import PencilIcon from '$components/icons/PencilIcon.svelte';
import PlusIcon from '$components/icons/PlusIcon.svelte';
import Popup from '$components/popup/Popup.svelte';
import { uploadProfilePicture } from '$lib/helpers/image';
import { getCroppedImg } from '$lib/utils/canvas';
import getDefaultImageUrl from '$lib/utils/getDefaultImageUrl';
import Log from '$lib/utils/Log';
import { authState } from '$stores/auth';
import Cropper from 'svelte-easy-crop/src/index.svelte';

export let src = '';
export let error = '';
export let loading = false;

let latestCropDetails: {
	x: number;
	y: number;
	height: number;
	width: number;
} | null = null;

let menuPopup = false;
let cropPopup = false;
let inputEl: HTMLInputElement;
let toCropSrc = '';
let toUploadSrc = '';

function checkFileSelected(files: FileList | null) {
	loading = true;
	if (files && files[0]) {
		menuPopup = false;
		cropPopup = true;
		// if (files[0].size / 1024 / 1024 > 5) {
		// 	//file is larger than 200 MiB
		// 	// invalidFileSelected = {
		// 	// 	show: true,
		// 	// 	error: 'size'
		// 	// };
		// 	loading = false;
		// 	return;
		// }
		toCropSrc = URL.createObjectURL(files[0]);
		loading = false;
	}
}

async function uploadImage(blob: Blob) {
	try {
		loading = true;
		const img = await uploadProfilePicture(blob);
		if (img) {
			src = img;
		} else {
			toUploadSrc = '';
			error = 'Something went wrong while uploading the photo. Please try again.';
			Log({ error: 'Something went wrong', from: '1 uploadImage' }, 'error');
		}

		loading = false;
	} catch (e) {
		error = 'Could not upload profile photo. Please try again.';
		toUploadSrc = '';
		loading = false;
		Log({ error: e, from: '1 uploadImage' }, 'error');
	}
}
</script>

<div class="relative flex h-48 w-48">
	{#if src}
		<img alt="User avatar" src="{src}" class="h-48 w-48 rounded-full object-cover" />
	{:else if toUploadSrc}
		<img alt="User avatar" src="{toUploadSrc}" class="h-48 w-48 rounded-full object-cover" />
		<div class="absolute inset-0 z-[5] flex items-center justify-center bg-black/50">Uploading</div>
	{:else}
		<img
			alt="User avatar"
			src="{getDefaultImageUrl($authState.idString)}"
			class="h-48 w-48 rounded-full object-cover" />
	{/if}
	<IconButton
		on:click="{() => (menuPopup = true)}"
		disabled="{loading}"
		class="absolute bottom-0 right-0 flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 focus:bg-orange-600">
		{#if !src}
			<PlusIcon class="h-4 w-4 text-white" />
		{:else}
			<PencilIcon class="h-4 w-4 text-white" />
		{/if}
	</IconButton>
</div>

<input
	type="file"
	accept="image/*"
	disabled="{loading}"
	bind:this="{inputEl}"
	class="hidden"
	on:change="{(e) => {
		checkFileSelected(e.currentTarget.files);
		inputEl.value = '';
	}}" />

<Popup bind:show="{menuPopup}" class="mx-20 w-full">
	<div class="flex w-full flex-col gap-4 divide-y-2 divide-zinc-200 text-black">
		{#if src}
			<button
				on:click="{() => {
					src = '';
					menuPopup = false;
				}}"
				class="text-red-500">Delete photo</button>
		{/if}
		<button class="{src ? 'pt-4' : ''}">Take photo</button>
		<button
			class="pt-4"
			on:click="{() => {
				inputEl?.click();
			}}">
			Choose photo
		</button>
	</div>
</Popup>

<Popup
	style="aspect-ratio: 3/4;"
	class="w-full overflow-hidden !bg-black/50"
	bind:show="{cropPopup}">
	<button
		on:click="{async () => {
			cropPopup = false;
			loading = true;
			const blob = await getCroppedImg(toCropSrc, latestCropDetails);
			toUploadSrc = URL.createObjectURL(blob);
			uploadImage(blob);
		}}"
		class="absolute inset-x-0 bottom-0 z-[100] flex items-center justify-center rounded-b-md bg-primary py-2 text-white">
		Continue
	</button>

	<Cropper
		cropShape="round"
		on:cropcomplete="{({ detail }) => (latestCropDetails = detail.pixels)}"
		image="{toCropSrc}"
		aspect="{1}"
		crop="{{ x: 0, y: 0 }}"
		zoom="{1}" />
</Popup>
