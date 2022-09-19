<script lang="ts">
import IconButton from '$components/button/IconButton.svelte';
import CaretLeftIcon from '$components/icons/CaretLeftIcon.svelte';
import ProfileLayout from '$components/layout/ProfileLayout.svelte';
import ProfileImageSelector from '$components/profile/ProfileImageSelector.svelte';
import Input from '$components/input/Input.svelte';
import Button from '$components/button/Button.svelte';
import { page } from '$app/stores';
import { onMount } from 'svelte';
import userProfile from '$stores/userProfile';
import { authStore } from '$stores/auth';
import { generateRandomName } from '$lib/utils/randomUsername';
import Log from '$lib/utils/Log';
import { updateProfile } from '$lib/helpers/profile';

let disabled = true;
let src = '';
let name = '';
let username = '';
let oldUsername = '';
let error = '';

async function isUsernameTaken() {
	if ($userProfile.unique_user_name[0] && username == $userProfile.unique_user_name[0]) {
		return false;
	} else {
		try {
			const { userIndex } = await import('$lib/helpers/backend');
			return await userIndex().get_index_details_is_user_name_taken(username);
		} catch (e) {
			return true;
		}
	}
}

function resetAllFields() {
	src = name = username = '';
}

async function saveChanges() {
	disabled = true;
	error = '';
	if (!name) {
		error = 'Name is required';
		disabled = false;
		Log({ error }, 'error');
		return;
	} else if (!username) {
		error = 'Username is required';
		disabled = false;
		Log({ error }, 'error');
		return;
	} else if (await isUsernameTaken()) {
		error = 'This username is already taken';
		disabled = false;
		Log({ error }, 'error');
		return;
	}

	Log({ res: { username, name, src }, from: '0 saveChanges' }, 'info');

	try {
		const { individualUser, userIndex } = await import('$lib/helpers/backend');
		if (oldUsername !== username) {
			await userIndex().update_index_with_unique_user_name_corresponding_to_user_principal_id(
				oldUsername,
				username
			);
		}
		const res = await individualUser().update_profile_details({
			display_name: [name],
			unique_user_name: [username],
			profile_picture_url: [src]
		});
		console.log('res', res);
		// if (res.Ok) {
		// 	await updateProfile(res.Ok);
		// }
		disabled = false;
	} catch (e) {
		disabled = false;
		Log({ error: e }, 'error');
	}
}

onMount(async () => {
	src = $userProfile.profile_picture_url[0] ?? '';
	name =
		$userProfile.display_name[0] ??
		generateRandomName('name', $authStore.principal?.toString() ?? $page.params.id);
	username =
		$userProfile.unique_user_name[0] ??
		generateRandomName('username', $authStore.principal?.toString() ?? $page.params.id);
	oldUsername = username;
	disabled = false;
});
</script>

<ProfileLayout>
	<svelte:fragment slot="top-left">
		<IconButton disabled="{disabled}" href="{`/profile/${$page.params.id}`}" class="shrink-0">
			<CaretLeftIcon class="h-7 w-7" />
		</IconButton>
	</svelte:fragment>

	<div slot="top-center" class="text-lg font-bold">Edit profile</div>

	<svelte:fragment slot="content">
		<div
			class="flex h-full w-full flex-col items-center justify-start space-y-8 overflow-y-auto p-8">
			<ProfileImageSelector bind:src />
			<div class="flex w-full flex-col space-y-2">
				<span class="text-white/60">Your name</span>
				<Input
					disabled="{disabled}"
					bind:value="{name}"
					type="text"
					placeholder="Enter your name here"
					class="w-full rounded-md bg-white/10 py-4" />
			</div>
			<div class="flex w-full flex-col space-y-2">
				<span class="text-white/60">Username</span>
				<Input
					disabled="{disabled}"
					bind:value="{username}"
					type="text"
					placeholder="Enter your username here"
					class="w-full rounded-md bg-white/10 py-4" />
			</div>
			{#if error}
				<span class="text-sm text-red-500">{error}</span>
			{/if}
			<div class="flex w-full items-center justify-between space-x-4 pt-16">
				<Button
					disabled="{disabled}"
					on:click="{resetAllFields}"
					type="secondary"
					class="w-full flex-1">
					Reset
				</Button>
				<Button disabled="{disabled}" on:click="{saveChanges}" prefetch class="w-full flex-1">
					Save changes
				</Button>
			</div>
		</div>
	</svelte:fragment>
</ProfileLayout>
