<script lang="ts">
import IconButton from '$components/button/IconButton.svelte';
import CaretLeftIcon from '$components/icons/CaretLeftIcon.svelte';
import PencilIcon from '$components/icons/PencilIcon.svelte';
import ProfileLayout from '$components/layout/ProfileLayout.svelte';
import ShareArrowIcon from '$components/icons/ShareArrowIcon.svelte';
import ProfileTabs from '$components/tabs/ProfileTabs.svelte';
import ProfilePost from '$components/profile/ProfilePost.svelte';
import NoBetsIcon from '$components/icons/NoBetsIcon.svelte';
import NoPostsIcon from '$components/icons/NoPostsIcon.svelte';
import Button from '$components/button/Button.svelte';
import ReportIcon from '$components/icons/ReportIcon.svelte';
import { page } from '$app/stores';
import { goto } from '$app/navigation';

let profile = {
	id: $page.params.id,
	name: 'Harsh Mandan',
	me: true,
	username: '@harsh',
	avatar: 'https://images.pexels.com/photos/3276046/pexels-photo-3276046.jpeg'
};
let posts = [1, 2, 3, 4, 5];

let selectedTab: 'posts' | 'trophy' = 'posts';
const dummy =
	'https://images.pexels.com/photos/11042025/pexels-photo-11042025.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';
</script>

<ProfileLayout>
	<svelte:fragment slot="top-left">
		<IconButton on:click="{() => history.back()}" class="shrink-0">
			<CaretLeftIcon class="h-7 w-7" />
		</IconButton>
	</svelte:fragment>
	<div slot="top-right" class="mt-0.5 flex shrink-0 items-center space-x-6">
		<IconButton>
			<ShareArrowIcon class="h-6 w-6" />
		</IconButton>
		{#if profile.me}
			<IconButton>
				<PencilIcon class="h-5 w-5" />
			</IconButton>
		{:else}
			<IconButton>
				<ReportIcon class="h-5 w-5" />
			</IconButton>
		{/if}
	</div>
	<div slot="top-center" class="text-lg font-bold">
		{#if profile.me}
			Your profile
		{/if}
	</div>

	<svelte:fragment slot="content">
		<div class="flex h-full w-full flex-col overflow-y-auto ">
			<div class="flex w-full flex-col items-center justify-center py-8">
				<img class="h-24 w-24 rounded-full" alt="{profile.name}" src="{profile.avatar}" />
				<span class="text-md pt-4 font-bold">{profile.name}</span>
				<span class="text-sm">{profile.username}</span>
			</div>
			<div
				class="mx-4 flex items-center justify-center divide-x-2 divide-white/20 rounded-full bg-white/10 py-4"
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
			{#if !profile.me}
				<div class="flex w-full items-center justify-between space-x-2 px-6 pt-6">
					<Button class="w-full">Love</Button>
					<Button type="secondary" class="w-full">Send tokens</Button>
				</div>
			{/if}
			<div class="px-6 pt-2">
				<ProfileTabs bind:selected="{selectedTab}" />
			</div>
			<div class="flex h-full flex-col px-6 py-6">
				{#if selectedTab === 'posts'}
					{#if posts.length}
						<div class="grid grid-cols-3 gap-3">
							{#each posts as post}
								<ProfilePost id="{`${post}`}" likes="{500}" imageBg="{dummy}" />
							{/each}
						</div>
					{:else}
						<div class="flex h-full w-full flex-col items-center justify-center space-y-8 px-8">
							<NoPostsIcon class="w-52" />
							<div class="text-center text-lg font-bold">
								{#if profile.me}
									You have not uploaded any videos yet
								{:else}
									This user has not uploaded any videos yet
								{/if}
							</div>
							{#if profile.me}
								<Button on:click="{() => goto('/upload')}" class="w-full"
									>Upload your first video</Button
								>
							{/if}
						</div>
					{/if}
				{:else}
					<div class="flex h-full w-full flex-col items-center justify-center space-y-8 px-8">
						<NoBetsIcon class="w-52" />
						<div class="text-center text-lg font-bold">
							{#if profile.me}
								You don't have any current bets yet
							{:else}
								This user has not placed any bets yet
							{/if}
						</div>
					</div>
				{/if}
			</div>
		</div>
	</svelte:fragment>
</ProfileLayout>
