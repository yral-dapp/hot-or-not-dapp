<script lang="ts">
import { goto } from '$app/navigation';
import { page } from '$app/stores';
import Button from '$components/button/Button.svelte';
import IconButton from '$components/button/IconButton.svelte';
import CaretLeftIcon from '$components/icons/CaretLeftIcon.svelte';
import LoadingIcon from '$components/icons/LoadingIcon.svelte';
import IntersectionObserver from '$components/intersection-observer/IntersectionObserver.svelte';
import ProfileLayout from '$components/layout/ProfileLayout.svelte';
import { fetchLovers, sanitizeProfile } from '$lib/helpers/profile';
import getDefaultImageUrl from '$lib/utils/getDefaultImageUrl';
import Log from '$lib/utils/Log';
import { generateRandomName } from '$lib/utils/randomUsername';
import type { PageData } from './$types';
import type { UserProfile } from '$stores/userProfile';
import { onMount } from 'svelte';
import userProfile from '$stores/userProfile';

export let data: PageData;
//@ts-ignore
const { me, fetchedProfile } = data;

let profile: UserProfile;
let loading = false;
let errorWhileFetching = false;
let noMoreLovers = false;
let fetchedLoversCount = 0;
let lovers: UserProfile[] = [];

$: userId = profile?.username_set
	? profile?.unique_user_name
	: profile?.principal_id || $page.params.id;

async function loadLovers() {
	if (noMoreLovers) {
		return;
	}

	loading = true;
	errorWhileFetching = false;
	try {
		const res = await fetchLovers($page.params.id, fetchedLoversCount);

		if (res.error) {
			errorWhileFetching = true;
			loading = false;
			return;
		}

		if (!res.lovers) {
			return;
		}

		console.log('res.livers', res.lovers);

		lovers.push(...res.lovers);
		lovers = lovers;
		noMoreLovers = res.noMoreLovers;
		fetchedLoversCount = lovers.length;
		loading = false;
	} catch (e) {
		Log({ error: e, from: '1 loadLovers' }, 'error');
	}

	loading = false;
}

onMount(() => {
	if (me) {
		profile = $userProfile;
	} else if (fetchedProfile) {
		profile = sanitizeProfile(fetchedProfile, $page.params.id);
	}
	Log({ from: '0 loversMount', id: $page.params.id, me, profile }, 'info');
});
</script>

<ProfileLayout>
	<svelte:fragment slot="top-left">
		<IconButton on:click="{() => goto(`/profile/${userId}`)}" class="shrink-0">
			<CaretLeftIcon class="h-7 w-7" />
		</IconButton>
	</svelte:fragment>
	<div slot="top-center" class="text-lg font-bold">
		{me ? 'Your Lovers' : 'Lovers'}
	</div>

	<svelte:fragment slot="content">
		<div class="flex h-full w-full flex-col space-y-8 overflow-y-auto p-8">
			{#each lovers as user, i}
				<div class="flex w-full items-center justify-between text-white">
					<div class="flex w-full items-center space-x-4 overflow-hidden">
						<img
							src="{user.profile_picture_url}"
							alt="avatar"
							class="h-10 w-10 shrink-0 rounded-full object-cover" />
						<div class="flex grow flex-col items-start overflow-hidden">
							<span>{user.display_name}</span>
							<span class="text-ellipsis whitespace-nowrap text-sm text-white/50">
								@{userId}
							</span>
						</div>
					</div>
					{#if $userProfile.principal_id !== user.principal_id}
						<div class="w-full max-w-[5rem] shrink-0">
							<Button class="w-full py-1 px-4 text-sm">Love</Button>
						</div>
					{/if}
				</div>
			{/each}
			{#if loading}
				<div class="flex w-full items-center justify-center space-x-2 py-8">
					<LoadingIcon class="h-4 w-4 animate-spin" />
					<span>Loading</span>
				</div>
			{/if}
			<IntersectionObserver
				on:intersected="{loadLovers}"
				disabled="{loading || errorWhileFetching}"
				intersect="{!noMoreLovers}">
				<svelte:fragment>
					<div class="h-2 w-full"></div>
				</svelte:fragment>
			</IntersectionObserver>
		</div>
	</svelte:fragment>
</ProfileLayout>
