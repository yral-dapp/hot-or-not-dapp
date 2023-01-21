<script lang="ts">
import { goto } from '$app/navigation';
import { page } from '$app/stores';
import Button from '$components/button/Button.svelte';
import IconButton from '$components/button/IconButton.svelte';
import CaretLeftIcon from '$components/icons/CaretLeftIcon.svelte';
import LoadingIcon from '$components/icons/LoadingIcon.svelte';
import IntersectionObserver from '$components/intersection-observer/IntersectionObserver.svelte';
import ProfileLayout from '$components/layout/ProfileLayout.svelte';
import { fetchLovers, loveUser, type UserProfileFollows } from '$lib/helpers/profile';
import Log from '$lib/utils/Log';
import { authState } from '$stores/auth';
import userProfile from '$stores/userProfile';
import type { PageData } from './$types';

export let data: PageData;
let { me, profile } = data;

let loading = false;
let errorWhileFetching = false;
let noMoreLovers = false;
let fetchedLoversCount = 0;
let lovers: UserProfileFollows[] = [];

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

async function handleLove(userIndex: number, userId?: string) {
	if (!userId) return;
	if (!$authState.isLoggedIn) {
		$authState.showLogin = true;
		return;
	}
	const res = await loveUser(userId);
	if (res) {
		lovers[userIndex].i_follow = !lovers[userIndex].i_follow;
		lovers = lovers;
	}
}
</script>

<svelte:head>
	<title>{me ? 'Your' : "User's"} Lovers | Hot or Not</title>
</svelte:head>

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
				{@const userId = user.username_set ? user.unique_user_name : user.principal_id || ''}
				<div class="flex w-full items-center justify-between text-white">
					<a href="/profile/{userId}" class="flex w-full items-center space-x-4 overflow-hidden">
						<img
							src="{user.profile_picture_url}"
							alt="avatar"
							class="h-10 w-10 shrink-0 rounded-full object-cover" />
						<div class="flex grow flex-col items-start overflow-hidden">
							<span>{user.display_name}</span>
							<span
								class="text-ellipsis whitespace-nowrap overflow-hidden text-sm w-full pr-4 text-white/50">
								{#if user.username_set}
									@{user.unique_user_name}
								{:else}
									{user.principal_id}
								{/if}
							</span>
						</div>
					</a>
					{#if $userProfile.principal_id !== user.principal_id}
						<div class="w-full max-w-[5rem] shrink-0">
							<Button
								type="{user.i_follow ? 'secondary' : 'primary'}"
								on:click="{() => handleLove(i, user.principal_id)}"
								class="w-full py-1 px-4 text-sm">
								{user.i_follow ? 'Loving' : 'Love'}
							</Button>
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
				threshold="{0.1}"
				intersect="{!noMoreLovers}">
				<svelte:fragment>
					<div class="h-2 w-full"></div>
				</svelte:fragment>
			</IntersectionObserver>
		</div>
	</svelte:fragment>
</ProfileLayout>
