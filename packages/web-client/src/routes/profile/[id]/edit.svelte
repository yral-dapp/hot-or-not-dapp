<script lang="ts">
import IconButton from '$components/button/IconButton.svelte';
import CaretLeftIcon from '$components/icons/CaretLeftIcon.svelte';
import ProfileLayout from '$components/layout/ProfileLayout.svelte';
import ProfileImageSelector from '$components/profile/ProfileImageSelector.svelte';
import Input from '$components/input/Input.svelte';
import Button from '$components/button/Button.svelte';
import { page } from '$app/stores';

let src = '';
let name = '';
let username = '';

function resetAllFields() {
	src = name = username = '';
}
</script>

<ProfileLayout>
	<svelte:fragment slot="top-left">
		<IconButton href="{`/profile/${$page.params.id}`}" class="shrink-0">
			<CaretLeftIcon class="h-7 w-7" />
		</IconButton>
	</svelte:fragment>

	<div slot="top-center" class="text-lg font-bold">Edit profile</div>

	<svelte:fragment slot="content">
		<div
			class="flex h-full w-full flex-col items-center justify-start space-y-8 overflow-y-auto p-8"
		>
			<ProfileImageSelector bind:src />
			<div class="flex w-full flex-col space-y-2">
				<span class="text-white/60">Your name</span>
				<Input
					bind:value="{name}"
					type="text"
					placeholder="Enter your name here"
					class="w-full rounded-md bg-white/10 py-4"
				/>
			</div>
			<div class="flex w-full flex-col space-y-2">
				<span class="text-white/60">Username</span>
				<Input
					bind:value="{username}"
					type="text"
					placeholder="Enter your username here"
					class="w-full rounded-md bg-white/10 py-4"
				/>
			</div>
			<div class="flex w-full items-center justify-between space-x-4 pt-16">
				<Button on:click="{resetAllFields}" type="secondary" class="w-full flex-1">Reset</Button>
				<Button prefetch class="w-full flex-1">Save changes</Button>
			</div>
		</div>
	</svelte:fragment>
</ProfileLayout>
