<script lang="ts" context="module">
import type { Load } from '@sveltejs/kit';

export const load: Load = async ({ params }) => {
	// console.log('fetch profile with id', params.id);
	const id = params.id;
	return {
		props: {
			profile: {
				name: 'Harsh',
				me: true
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
	<svelte:fragment slot="content">
		<div class="h-full w-full"></div>
	</svelte:fragment>

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
</ProfileLayout>
