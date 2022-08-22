<script lang="ts" context="module">
import type { Load } from '@sveltejs/kit';

export const load: Load = async ({ params }) => {
	// console.log('fetch profile with id', params.id);
	const id = params.id;
	return {
		props: {
			profile: {
				name: 'Harsh Mandan',
				me: true,
				username: '@harsh',
				avatar: 'https://images.pexels.com/photos/3276046/pexels-photo-3276046.jpeg'
			}
		}
	};
};
</script>

<script lang="ts">
import IconButton from '$components/button/IconButton.svelte';
import CaretLeftIcon from '$components/icons/CaretLeftIcon.svelte';
import PencilIcon from '$components/icons/PencilIcon.svelte';
import ProfileLayout from '$components/layout/ProfileLayout.svelte';
import ShareArrowIcon from '$components/icons/ShareArrowIcon.svelte';

export let profile: any;
</script>

<ProfileLayout>
	<svelte:fragment slot="top-left">
		<IconButton class="shrink-0">
			<CaretLeftIcon class="h-7 w-7" />
		</IconButton>
	</svelte:fragment>
	<div slot="top-right" class="mt-0.5 flex shrink-0 items-center space-x-6">
		<IconButton>
			<ShareArrowIcon class="h-6 w-6" />
		</IconButton>
		<IconButton>
			<PencilIcon class="h-5 w-5" />
		</IconButton>
	</div>
	<div slot="top-center" class="text-lg font-bold">
		{#if profile.me}
			Your profile
		{:else}
			{profile.name}'s Profile
		{/if}
	</div>

	<svelte:fragment slot="content">
		<div class="flex h-full w-full flex-col">
			<div class="flex w-full flex-col items-center justify-center py-8">
				<img class="h-24 w-24 rounded-full" alt="{profile.name}" src="{profile.avatar}" />
				<span class="text-md pt-4 font-bold">{profile.name}</span>
				<span class="text-sm">{profile.username}</span>
			</div>
			<div
				class="mx-6 flex items-center justify-center divide-x-2 divide-white/20 rounded-full bg-white/10 py-4"
			>
				<div class="flex flex-col items-center space-y-1 px-4">
					<span class="whitespace-nowrap text-xl font-bold">110</span>
					<span class="text-sm">Lovers</span>
				</div>
				<div class="flex flex-col items-center space-y-1 px-4">
					<span class="whitespace-nowrap text-xl font-bold">2.2 K</span>
					<span class="text-sm">Earnings</span>
				</div>
				<div class="flex flex-col items-center space-y-1 px-4">
					<span class="whitespace-nowrap text-xl font-bold">2.2 M</span>
					<span class="text-sm">Hots</span>
				</div>
				<div class="flex flex-col items-center space-y-1 px-4">
					<span class="whitespace-nowrap text-xl font-bold">1.1 M</span>
					<span class="text-sm">Nots</span>
				</div>
			</div>
		</div>
	</svelte:fragment>
</ProfileLayout>
