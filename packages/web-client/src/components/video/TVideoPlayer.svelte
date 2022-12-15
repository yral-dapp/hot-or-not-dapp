<script lang="ts">
import Avatar from '$components/avatar/Avatar.svelte';
import IconButton from '$components/button/IconButton.svelte';
import EyeIcon from '$components/icons/EyeIcon.svelte';
import FireIcon from '$components/icons/FireIcon.svelte';
import HeartIcon from '$components/icons/HeartIcon.svelte';
import ShareMessageIcon from '$components/icons/ShareMessageIcon.svelte';
import LoadingIcon from '$components/icons/LoadingIcon.svelte';
import { isiPhone } from '$lib/utils/isSafari';
import c from 'clsx';
import { playerState } from '$stores/playerState';
import SoundIcon from '$components/icons/SoundIcon.svelte';
import { authState } from '$stores/auth';
import type { IndividualUserActor } from '$lib/helpers/backend';
import getDefaultImageUrl from '$lib/utils/getDefaultImageUrl';
import Log from '$lib/utils/Log';
import { generateRandomName } from '$lib/utils/randomUsername';
import type { Principal } from '@dfinity/principal';
import { createEventDispatcher, tick } from 'svelte';
import userProfile from '$stores/userProfile';
import { registerEvent } from '$components/seo/GoogleAnalytics.svelte';
import Hls from 'hls.js';
import { onMount } from 'svelte';

export let src: string;
export let i: number;
export let id: bigint;
export let inView = false;
export let thumbnail = '';
export let displayName = '';
export let profileLink = '';
export let description = '';
export let videoViews = 254000;
export let publisherCanisterId: string;
export let userProfileSrc = '';
export let liked = false;
export let createdById = '';
export let likeCount: number = 0;
export let enrolledInHotOrNot = false;

const dispatch = createEventDispatcher<{
	watchedPercentage: number;
	loaded: void;
	inView: { hls: Hls; i: number };
}>();

let hls: Hls;

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
}

$: if (inView) {
	dispatch('inView', { hls, i });
}
onMount(() => {
	hls = new Hls();
	hls.loadSource(src);
	//@ts-ignore
	hls.on('hlsManifestLoaded', () => {
		console.log('manifest loaded', i);
	});
	return () => {
		hls.destroy();
	};
});
</script>

<player
	i="{i}"
	class="{c(
		'block h-full items-center justify-center overflow-auto w-full transition-all duration-500'
	)}">
	<img alt="fg" src="{thumbnail}" class="object-cover w-full absolute z-[3] inset-0 my-auto" />
	<img
		alt="bg"
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
					<HeartIcon filled="{liked}" class="h-8 w-8" />
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
			class="absolute bottom-20 left-4 z-[9] pr-20">
			<div class="pointer-events-auto flex space-x-3">
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
