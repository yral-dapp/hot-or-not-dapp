<script lang="ts">
import IconButton from '$components/button/IconButton.svelte';
import PencilIcon from '$components/icons/PencilIcon.svelte';
import PlusIcon from '$components/icons/PlusIcon.svelte';
import UserAvatarIcon from '$components/icons/UserAvatarIcon.svelte';

export let src = '';

function checkFileSelected(files: FileList | null) {
	loading = true;
	if (files && files[0]) {
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
		on:click="{() => inputEl?.click()}"
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
