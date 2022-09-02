<script lang="ts">
import IconButton from '$components/button/IconButton.svelte';
import CaretLeftIcon from '$components/icons/CaretLeftIcon.svelte';
import ProfileLayout from '$components/layout/ProfileLayout.svelte';
import ProfileImageSelector from '$components/profile/ProfileImageSelector.svelte';
import Input from '$components/input/Input.svelte';
import Button from '$components/button/Button.svelte';
</script>

<ProfileLayout>
	<svelte:fragment slot="top-left">
		<IconButton on:click="{() => history.back()}" class="shrink-0">
			<CaretLeftIcon class="h-7 w-7" />
		</IconButton>
	</svelte:fragment>

	<div slot="top-center" class="text-lg font-bold">Edit profile</div>

	<svelte:fragment slot="content">
		<div
			class="flex h-full w-full flex-col items-center justify-start space-y-8 overflow-y-auto p-8"
		>
			<ProfileImageSelector src="" />
			<div class="flex w-full flex-col space-y-2">
				<span class="text-white/60">Your name</span>
				<Input
					type="text"
					placeholder="Enter your name here"
					class="w-full rounded-md bg-white/10 py-4"
				/>
			</div>
			<div class="flex w-full flex-col space-y-2">
				<span class="text-white/60">Username</span>
				<Input
					type="text"
					placeholder="Enter your username here"
					class="w-full rounded-md bg-white/10 py-4"
				/>
			</div>
			<div class="flex w-full items-center justify-between space-x-4 pt-16">
				<Button type="secondary" class="w-full flex-1">Reset</Button>
				<Button prefetch class="w-full flex-1">Save changes</Button>
			</div>
		</div>
	</svelte:fragment>
</ProfileLayout>
