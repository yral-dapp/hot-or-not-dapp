<script lang="ts">
import type { IndividualUserActor } from '$lib/helpers/backend';
import { onMount } from 'svelte';
import VideoPlayer from '$components/video/VideoPlayer.svelte';
import { getMp4Url, getThumbnailUrl } from '$lib/utils/cloudflare';
import type { PageData } from './$types';
import HomeLayout from '$components/layout/HomeLayout.svelte';
import BottomNavigation from '$components/navigation/BottomNavigation.svelte';
import IconButton from '$components/button/IconButton.svelte';
import CaretLeftIcon from '$components/icons/CaretLeftIcon.svelte';
import { goto } from '$app/navigation';
import { page } from '$app/stores';

export let data: PageData;

const { video, publisherId, me } = data;

let individualUser: () => IndividualUserActor;

onMount(async () => {
	individualUser = (await import('$lib/helpers/backend')).individualUser;
});
</script>

<HomeLayout>
	<svelte:fragment slot="top">
		{#if me != undefined}
			<div class="flex w-full items-center justify-center pt-2">
				<div class="rounded-full bg-black/50 py-2 px-4">
					{me ? 'Your' : "User's"} Videos
				</div>
			</div>
		{/if}

		<div class="absolute top-4 left-4">
			<IconButton
				on:click="{() =>
					history.length > 2 ? history.back() : goto(`/profile/${$page.params.id}`)}">
				<CaretLeftIcon class="h-5 w-5" />
			</IconButton>
		</div>
	</svelte:fragment>
	<svelte:fragment slot="content">
		<div class="relative h-full w-full text-white">
			{#if individualUser}
				<VideoPlayer
					i="{0}"
					id="{video.id}"
					displayName="{video.created_by_display_name[0]}"
					profileLink="{video.created_by_unique_user_name[0] ??
						video.created_by_user_principal_id.toText()}"
					liked="{video.liked_by_me}"
					videoViews="{Number(video.total_view_count)}"
					createdById="{video.created_by_user_principal_id.toText()}"
					publisherCanisterId="{publisherId}"
					userProfileSrc="{video.created_by_profile_photo_url[0]}"
					individualUser="{individualUser}"
					inView
					swiperJs
					thumbnail="{getThumbnailUrl(video.video_uid)}"
					src="{getMp4Url(video.video_uid)}" />
			{/if}
		</div>
	</svelte:fragment>
	<div class="w-full" slot="bottom-navigation">
		<BottomNavigation />
	</div>
</HomeLayout>
