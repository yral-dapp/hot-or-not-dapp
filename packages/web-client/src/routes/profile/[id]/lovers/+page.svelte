<script lang="ts">
import { goto } from '$app/navigation';
import { page } from '$app/stores';
import Button from '$components/button/Button.svelte';
import IconButton from '$components/button/IconButton.svelte';
import CaretLeftIcon from '$components/icons/CaretLeftIcon.svelte';
import ProfileLayout from '$components/layout/ProfileLayout.svelte';
import getDefaultImageUrl from '$lib/utils/getDefaultImageUrl';
import { generateRandomName } from '$lib/utils/randomUsername';

let profile = {
	id: $page.params.id,
	me: $page.params.id == '1'
};

let lovers = [1, 2, 3, 4, 5];
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
		</div>
	</svelte:fragment>
</ProfileLayout>
