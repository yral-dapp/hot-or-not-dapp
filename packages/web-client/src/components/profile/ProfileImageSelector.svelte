<script lang="ts">
import IconButton from '$components/button/IconButton.svelte';
import CheckIcon from '$components/icons/CheckIcon.svelte';
import PencilIcon from '$components/icons/PencilIcon.svelte';
import PlusIcon from '$components/icons/PlusIcon.svelte';
import UserAvatarIcon from '$components/icons/UserAvatarIcon.svelte';
import Popup from '$components/popup/Popup.svelte';
import { getCroppedImg } from '$lib/canvasUtils';
import Cropper from 'svelte-easy-crop/src/index.svelte';

export let src = '';
let latestCropDetails: {
	x: number;
	y: number;
	height: number;
	width: number;
} | null = null;

$: console.log({ latestCropDetails });

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

		src = URL.createObjectURL(files[0]);

		console.log('file is fine', files);
		loading = false;
	}
}

let menuPopup = false;
let cropPopup = false;
let inputEl: HTMLInputElement;
let loading = false;
</script>

<div class="relative flex h-48 w-48">
	{#if !src}
		<div class="flex h-48 w-48 items-center justify-center rounded-full bg-white/20">
			<UserAvatarIcon class="h-24 w-24 text-white/30" />
		</div>
	{:else}
		<img alt="User avatar" src="{src}" class="h-48 w-48 rounded-full object-cover" />
	{/if}
	<IconButton
		on:click="{() => (menuPopup = true)}"
		disabled="{loading}"
		class="absolute bottom-0 right-0 flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 focus:bg-orange-600"
	>
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
	on:change="{(e) => checkFileSelected(e.currentTarget.files)}"
/>

<Popup on:close="{() => (inputEl.value = '')}" bind:show="{menuPopup}" class="mx-20 w-full">
	<div class="flex w-full flex-col gap-4 divide-y-2 divide-zinc-200 text-black">
		{#if src}
			<button
				on:click="{() => {
					src = '';
					menuPopup = false;
				}}"
				class="text-red-500">Delete photo</button
			>
		{/if}
		<button class="{src ? 'pt-4' : ''}">Take photo</button>
		<button
			class="pt-4"
			on:click="{() => {
				inputEl?.click();
			}}"
		>
			Choose photo
		</button>
	</div>
</Popup>

<Popup class="h-1/2" bind:show="{cropPopup}">
	<div
		class="absolute left-2 top-2 z-[100] rounded-md bg-white px-4 py-2 text-black backdrop-blur-md"
	>
		Crop image to continue
	</div>

	<IconButton
		on:click="{async () => {
			src = await getCroppedImg(src, latestCropDetails);
			cropPopup = false;
		}}"
		class="absolute right-2 top-2 z-[100] flex h-10 w-10 items-center rounded-full bg-primary text-white backdrop-blur-md"
	>
		<CheckIcon class="h-4 w-4" />
	</IconButton>
	<Cropper
		on:cropcomplete="{({ detail }) => (latestCropDetails = detail.pixels)}"
		image="{src}"
		aspect="{1}"
		crop="{{ x: 0, y: 0 }}"
		zoom="{1}"
	/>
</Popup>
