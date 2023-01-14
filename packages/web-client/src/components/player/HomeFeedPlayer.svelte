<script lang="ts">
import Avatar from '$components/avatar/Avatar.svelte';
import IconButton from '$components/button/IconButton.svelte';
import EyeIcon from '$components/icons/EyeIcon.svelte';
import FireIcon from '$components/icons/FireIcon.svelte';
import HeartIcon from '$components/icons/HeartIcon.svelte';
import ShareMessageIcon from '$components/icons/ShareMessageIcon.svelte';
import { registerEvent } from '$components/seo/GA.svelte';
import type { IndividualUserActor } from '$lib/helpers/backend';
import getDefaultImageUrl from '$lib/utils/getDefaultImageUrl';
import { generateRandomName } from '$lib/utils/randomUsername';
import { authState } from '$stores/auth';
import userProfile from '$stores/userProfile';
import type { Principal } from '@dfinity/principal';

export let i: number;
export let id: bigint;
export let thumbnail = '';
export let displayName = '';
export let profileLink = '';
export let description = '';
export let videoViews = 254000;
export let publisherCanisterId: string;
export let userProfileSrc = '';
export let liked = false;
export let createdById = '';
export let individualUser: (principal?: Principal | string) => IndividualUserActor;
export let likeCount: number = 0;
export let enrolledInHotOrNot = false;

async function handleLike() {
	if ($authState.isLoggedIn) {
		liked = !liked;
		registerEvent('like_video', {
			userId: $userProfile.principal_id,
			video_publisher_id: profileLink,
			video_publisher_canister_id: publisherCanisterId,
			video_id: id,
			likes: likeCount
		});
		await individualUser(publisherCanisterId).update_post_toggle_like_status_by_caller(id);
	} else $authState.showLogin = true;
}

async function handleShare() {
	try {
		await navigator.share({
			title: 'Hot or Not',
			text: `Check out this hot video by ${displayName}. \n${description}`,
			url: `https://hotornot.wtf/feed/${publisherCanisterId}@${id}`
		});
	} catch (_) {}
	registerEvent('share_video', {
		userId: $userProfile.principal_id,
		video_publisher_id: profileLink,
		video_publisher_canister_id: publisherCanisterId,
		video_id: id
	});
	await individualUser(publisherCanisterId).update_post_increment_share_count(id);
}
</script>

<player
	i="{i}"
	class="w-full block h-full items-center justify-center overflow-auto transition-all duration-500">
	<slot />
	<img
		alt="background"
		class="absolute inset-0 z-[1] h-full w-full origin-center object-cover blur-xl"
		src="{thumbnail}" />

	<div
		style="background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 10%, rgba(0,0,0,0.8) 100%);"
		class="fade-in pointer-events-none absolute bottom-0 z-[10] block h-64 w-full">
		<div
			style="-webkit-transform: translate3d(0, 0, 0);"
			class="max-w-16 pointer-events-auto absolute right-4 bottom-20 z-[10]">
			<div class="flex flex-col space-y-6">
				<IconButton
					ariaLabel="Toggle like on this post"
					on:click="{(e) => {
						e.stopImmediatePropagation();
						handleLike();
					}}">
					<HeartIcon filled="{liked && $authState.isLoggedIn}" class="h-8 w-8" />
				</IconButton>
				<IconButton
					ariaLabel="Share this post"
					on:click="{(e) => {
						e.stopImmediatePropagation();
						handleShare();
					}}">
					<ShareMessageIcon class="h-6 w-6" />
				</IconButton>
				<IconButton
					ariaLabel="Check out this post in Hot or Not"
					disabled="{!enrolledInHotOrNot}"
					href="{`/hotornot/${publisherCanisterId}@${id}`}"
					class="rounded-full border-[0.15rem] border-[#FA9301] bg-gradient-to-b from-[#F63700] to-[#FFC848] p-2">
					<FireIcon class="h-5 w-5" />
				</IconButton>
			</div>
		</div>

		<div
			style="-webkit-transform: translate3d(0, 0, 0);"
			class="absolute bottom-20 flex flex-col space-y-2 left-4 z-[9] pr-20">
			<div aria-roledescription="video-info" class="pointer-events-auto flex space-x-3">
				<a href="/profile/{profileLink}" class="h-12 w-12 shrink-0">
					<Avatar class="h-12 w-12" src="{userProfileSrc || getDefaultImageUrl(createdById)}" />
				</a>
				<div class="flex flex-col space-y-1 capitalize">
					<a href="/profile/{profileLink}">
						{displayName || generateRandomName('name', createdById)}
					</a>
					<div class="flex items-center space-x-1">
						<EyeIcon class="h-4 w-4 text-white" />
						<span class="text-sm">{videoViews}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</player>
