<script lang="ts">
import { goto } from '$app/navigation';
import { page } from '$app/stores';
import Button from '$components/button/Button.svelte';
import IconButton from '$components/button/IconButton.svelte';
import CaretLeftIcon from '$components/icons/CaretLeftIcon.svelte';
import IntersectionObserver from '$components/intersection-observer/IntersectionObserver.svelte';
import ProfileLayout from '$components/layout/ProfileLayout.svelte';
import { fetchLovers } from '$lib/helpers/profile';
import getDefaultImageUrl from '$lib/utils/getDefaultImageUrl';
import Log from '$lib/utils/Log';
import { generateRandomName } from '$lib/utils/randomUsername';
import type { Principal } from '@dfinity/principal';

let profile = {
	id: $page.params.id,
	me: $page.params.id == '1'
};

let loading = false;
let errorWhileFetching = false;
let noMoreLovers = false;
let fetchedLoversCount = 0;
let lovers: Principal[] = [];

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
</script>

<ProfileLayout>
	<svelte:fragment slot="top-left">
		<IconButton on:click="{() => goto(`/profile/${profile.id}`)}" class="shrink-0">
			<CaretLeftIcon class="h-7 w-7" />
		</IconButton>
	</svelte:fragment>
	<div slot="top-center" class="text-lg font-bold">
		{#if profile.me}
			Your Lovers
		{/if}
	</div>

	<svelte:fragment slot="content">
		<div class="flex h-full w-full flex-col space-y-8 overflow-y-auto p-8">
			{#each lovers as _, i}
				<div class="flex w-full items-center justify-between text-white">
					<div class="flex items-center space-x-4">
						<img
							src="{getDefaultImageUrl(i.toString())}"
							alt="avatar"
							class="h-10 w-10 rounded-full object-cover" />
						<div class="flex flex-col items-start">
							<span>{generateRandomName('name', i.toString())}</span>
							<span class="text-sm text-white/50">
								@{generateRandomName('username', i.toString())}
							</span>
						</div>
					</div>
					<div class="w-full max-w-[5rem]">
						<Button class="w-full py-1 px-4 text-sm">Love</Button>
					</div>
				</div>
			{/each}
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
