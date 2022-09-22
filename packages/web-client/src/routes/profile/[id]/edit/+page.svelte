<script lang="ts">
import IconButton from '$components/button/IconButton.svelte';
import CaretLeftIcon from '$components/icons/CaretLeftIcon.svelte';
import ProfileLayout from '$components/layout/ProfileLayout.svelte';
import ProfileImageSelector from '$components/profile/ProfileImageSelector.svelte';
import Input from '$components/input/Input.svelte';
import Button from '$components/button/Button.svelte';
import { page } from '$app/stores';
import { onMount } from 'svelte';
import Log from '$lib/utils/Log';
import type { PageData } from './$types';
import userProfile from '$stores/userProfile';

export let data: PageData;
let { username, username_set, displayName, imgSrc, userPrincipal } = data;

let loaded = false;
let disabled = true;
let error = '';
let values: {
	username: string;
	name: string;
	imageSrc: string;
};

async function isUsernameTaken() {
	if (!username_set) {
		return false;
	} else if (values.username === username) {
		return false;
	} else {
		try {
			const { userIndex } = await import('$lib/helpers/backend');
			return await userIndex().get_index_details_is_user_name_taken(values.username);
		} catch (e) {
			return true;
		}
	}
}

function resetAllFields() {
	values = {
		username: '',
		name: '',
		imageSrc: ''
	};
}

async function saveChanges() {
	disabled = true;
	error = '';
	if (!values.name) {
		error = 'Name is required';
		disabled = false;
		Log({ error }, 'error');
		return;
	} else if (!values.username) {
		error = 'Username is required';
		disabled = false;
		Log({ error }, 'error');
		return;
	} else if (!username_set && (await isUsernameTaken())) {
		error = 'This username is already taken';
		disabled = false;
		Log({ error }, 'error');
		return;
	}

	Log({ res: values, from: '0 saveChanges' }, 'info');

	const { individualUser, userIndex } = await import('$lib/helpers/backend');
	if (username !== values.username) {
		try {
			Promise.all([
				userIndex().update_index_with_unique_user_name_corresponding_to_user_principal_id(
					values.username,
					userPrincipal
				),
				individualUser().update_profile_set_unique_username_once(values.username)
			]);
			username_set = true;
			username = values.username;

			$userProfile.username_set = true;
			$userProfile.unique_user_name = values.username;
		} catch (e) {
			disabled = false;
			Log({ error: e, from: '1 saveChanges' }, 'error');
		}
	}
	try {
		const res = await individualUser().update_profile_display_details({
			display_name: [values.name],
			profile_picture_url: [values.imageSrc]
		});

		displayName = values.name;
		imgSrc = values.imageSrc;
		console.log('res', res);
		if ('Ok' in res) {
			$userProfile.display_name = res.Ok.display_name[0] ?? '';
			$userProfile.profile_picture_url = res.Ok.profile_picture_url[0] ?? '';
		}
		disabled = false;
	} catch (e) {
		disabled = false;
		Log({ error: e, from: '2 saveChanges' }, 'error');
	}
}

onMount(async () => {
	values = {
		username: username ?? '',
		name: displayName ?? '',
		imageSrc: imgSrc ?? ''
	};
	disabled = false;
	loaded = true;
});
</script>

{#if loaded}
	<ProfileLayout>
		<svelte:fragment slot="top-left">
			<IconButton disabled="{disabled}" href="{`/profile/${username}`}" class="shrink-0">
				<CaretLeftIcon class="h-7 w-7" />
			</IconButton>
		</svelte:fragment>

		<div slot="top-center" class="text-lg font-bold">Edit profile</div>

		<svelte:fragment slot="content">
			<div
				class="flex h-full w-full flex-col items-center justify-start space-y-8 overflow-y-auto p-8">
				<ProfileImageSelector bind:src="{values.imageSrc}" />
				<div class="flex w-full flex-col space-y-2">
					<span class="text-white/60">Your name</span>
					<Input
						disabled="{disabled}"
						bind:value="{values.name}"
						type="text"
						placeholder="Enter your name here"
						class="w-full rounded-md bg-white/10 py-4" />
				</div>
				<div class="flex w-full flex-col space-y-2">
					<span class="text-white/60">Username</span>
					<Input
						disabled="{disabled || username_set}"
						bind:value="{values.username}"
						type="text"
						placeholder="Enter your username here"
						class="w-full rounded-md bg-white/10 py-4" />
					{#if username_set}
						<span class="text-xs opacity-50">
							You have already set your username, it cannot be changed now. You can change your
							display name or profile picture
						</span>
					{:else}
						<span class="text-xs opacity-50">You can only set/change your username once</span>
					{/if}
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
{/if}
