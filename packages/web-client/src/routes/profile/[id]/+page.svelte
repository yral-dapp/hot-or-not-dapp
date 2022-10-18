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
import SpeculationPost from '$components/profile/SpeculationPost.svelte';
import userProfile, { type UserProfile } from '$stores/userProfile';
import { Principal } from '@dfinity/principal';
import { onMount } from 'svelte';
import type { PageData } from './$types';
import navigateBack from '$stores/navigateBack';
import { page } from '$app/stores';
import { fetchPosts, sanitizeProfile } from '$lib/helpers/profile';
import Log from '$lib/utils/Log';
import { authHelper, authState } from '$stores/auth';
import type { PostDetailsForFrontend } from '$canisters/individual_user_template/individual_user_template.did';
import LoadingIcon from '$components/icons/LoadingIcon.svelte';
import { getThumbnailUrl } from '$lib/utils/cloudflare';
import IntersectionObserver from '$components/intersection-observer/IntersectionObserver.svelte';
import { registerEvent } from '$components/seo/GoogleAnalytics.svelte';

export let data: PageData;
//@ts-ignore
const { me, fetchedProfile } = data;

let load = {
	page: true,
	posts: false,
	follow: false
};

const speculations: any = [];

let profile: UserProfile;
let fetchedPosts: PostDetailsForFrontend[] = [];
let errorWhileFetching = false;
let noMorePosts = false;
let fetchedPostsCount = 0;

$: userId = fetchedProfile?.username_set
	? fetchedProfile?.unique_user_name
	: fetchedProfile?.principal_id || $page.params.id;

async function showShareDialog() {
	try {
		if (!navigator.canShare) {
			console.error('Browser does not support share dialog');
			return;
		}
		await navigator.share({
			title: 'Hot or Not',
			text: 'Video title',
			url: `https://hotornot.wtf/profile/${userId}`
		});
		registerEvent('share_profile', {
			userId: $userProfile.principal_id,
			'Profile Id': $page.params.id
		});
	} catch (err) {
		console.error('Cannot open share dialog', err);
	}
}

let selectedTab: 'posts' | 'trophy' = 'posts';

async function loveUser() {
	load.follow = true;
	const individualUser = (await import('$lib/helpers/backend')).individualUser;
	const userPrincipal = Principal.from(profile.principal_id);
	try {
		const res =
			await individualUser().update_principals_i_follow_toggle_list_with_principal_specified(
				userPrincipal
			);
		console.log('loveUser res', res);
		if ('Ok' in res) {
			profile.followers_count++;
			profile = profile;
		} else {
		}
		load.follow = false;
	} catch (e) {
		console.log('loveUser, error', e);
		load.follow = false;
	}
}

async function loadPosts() {
	if (noMorePosts) {
		return;
	}

	load.posts = true;
	errorWhileFetching = false;
	const res = await fetchPosts($page.params.id, fetchedPostsCount);

	if (res.error) {
		errorWhileFetching = true;
		load.posts = false;
		return;
	}

	fetchedPosts.push(...res.posts);
	fetchedPosts = fetchedPosts;
	noMorePosts = res.noMorePosts;
	fetchedPostsCount = fetchedPosts.length;
	load.posts = false;
}

onMount(() => {
	if (me) {
		profile = $userProfile;
	} else if (fetchedProfile) {
		profile = sanitizeProfile(fetchedProfile, $page.params.id);
	}
	registerEvent('view_profile', {
		userId: $userProfile.principal_id,
		'profile Id': $page.params.id
	});
	load.page = false;
	Log({ from: '0 profileMount', id: $page.params.id, me, profile }, 'info');
});
</script>

{#if !load.page}
	<ProfileLayout>
		<svelte:fragment slot="top-left">
			<IconButton
				href="{$navigateBack && !$navigateBack.includes('edit') ? $navigateBack : '/menu'}"
				class="shrink-0">
				<CaretLeftIcon class="h-7 w-7" />
			</IconButton>
		</svelte:fragment>
		<div slot="top-right" class="mt-0.5 flex shrink-0 items-center space-x-6">
			<IconButton on:click="{showShareDialog}">
				<ShareArrowIcon class="h-6 w-6" />
			</IconButton>
			{#if me}
				<IconButton href="{`/profile/${userId}/edit`}">
					<PencilIcon class="h-5 w-5" />
				</IconButton>
			{:else}
				<IconButton>
					<ReportIcon class="h-5 w-5" />
				</IconButton>
			{/if}
		</div>
		<div slot="top-center" class="text-lg font-bold">
			{#if me}
				Your profile
			{/if}
		</div>

		<svelte:fragment slot="content">
			<div class="flex h-full w-full flex-col overflow-y-auto ">
				<div class="flex w-full flex-col items-center justify-center py-8">
					<img
						class="h-24 w-24 rounded-full"
						alt="{profile.display_name}"
						src="{profile.profile_picture_url}" />
					<span class="text-md pt-4 font-bold">
						{profile.display_name}
					</span>
					<span class="text-sm">
						{`@${profile.unique_user_name}`}
					</span>
				</div>
				<div
					class="mx-4 flex items-center justify-center divide-x-2 divide-white/20 rounded-full bg-white/10 p-4">
					<a
						href="{`/profile/${userId}/lovers`}"
						class="flex flex-1 flex-col items-center space-y-0.5 px-2">
						<span class="whitespace-nowrap text-xl font-bold">
							{profile.followers_count}
						</span>
						<span class="text-sm">Lovers</span>
					</a>
					<div class="flex flex-1 flex-col items-center space-y-0.5 px-2">
						<span class="whitespace-nowrap text-xl font-bold">
							{profile.profile_stats.lifetime_earnings}
						</span>
						<span class="text-sm">Earnings</span>
					</div>
					<div class="flex flex-1 flex-col items-center space-y-0.5 px-2">
						<span class="whitespace-nowrap text-xl font-bold">
							{profile.profile_stats.hots_earned_count}
						</span>
						<span class="text-sm">Hots</span>
					</div>
					<div class="flex flex-1 flex-col items-center space-y-0.5 px-2">
						<span class="whitespace-nowrap text-xl font-bold">
							{profile.profile_stats.nots_earned_count}
						</span>
						<span class="text-sm">Nots</span>
					</div>
				</div>
				{#if !me}
					<div class="flex w-full items-center justify-between space-x-2 px-6 pt-6">
						<Button disabled="{load.follow}" on:click="{loveUser}" class="mx-auto w-[10rem]">
							Love
						</Button>
						<!-- <Button type="secondary" class="w-full">Send tokens</Button> -->
					</div>
				{/if}
				<div class="px-6 pt-2">
					<ProfileTabs bind:selected="{selectedTab}" />
				</div>
				<div class="flex h-full flex-col px-6 py-6">
					{#if selectedTab === 'posts'}
						{#if fetchedPosts.length}
							<div class="grid grid-cols-3 gap-3">
								{#each fetchedPosts as post}
									<ProfilePost
										id="{Number(post.id)}"
										likes="{Number(post.like_count)}"
										imageBg="{getThumbnailUrl(post.video_uid)}" />
								{/each}
							</div>
						{:else if !load.posts && !errorWhileFetching}
							<div class="flex h-full w-full flex-col items-center justify-center space-y-8 px-8">
								<NoPostsIcon class="w-52" />
								<div class="text-center text-lg font-bold">
									{#if me}
										You have not uploaded any videos yet
									{:else}
										This user has not uploaded any videos yet
									{/if}
								</div>
								{#if me}
									<Button href="/upload" prefetch class="w-full">Upload your first video</Button>
								{/if}
							</div>
						{/if}
						{#if errorWhileFetching}
							<div class="flex w-full flex-col items-center justify-center space-y-2 py-8 ">
								<div class="flex items-center space-x-2 text-sm text-red-500">
									<ReportIcon class="h-4 w-4" />
									<span>Error while fetching posts</span>
								</div>
								<Button on:click="{loadPosts}" type="secondary" class="py-2 px-6 text-xs">
									Try again
								</Button>
							</div>
						{:else if load.posts}
							<div class="flex w-full items-center justify-center space-x-2 py-8">
								<LoadingIcon class="h-4 w-4 animate-spin" />
								<span>Fetching posts</span>
							</div>
						{/if}
						{#if noMorePosts && fetchedPosts.length}
							<div class="flex w-full items-center justify-center space-x-2 py-8 opacity-40">
								<span>No more posts</span>
							</div>
						{/if}

						<IntersectionObserver
							on:intersected="{loadPosts}"
							disabled="{load.posts || errorWhileFetching}"
							intersect="{!noMorePosts}">
							<svelte:fragment>
								<div class="h-2 w-full"></div>
							</svelte:fragment>
						</IntersectionObserver>
					{:else if speculations.length}
						<div class="grid grid-cols-2 gap-3">
							{#each speculations as speculation}
								<SpeculationPost me="{me}" {...speculation} />
							{/each}
						</div>
					{:else}
						<div class="flex h-full w-full flex-col items-center justify-center space-y-8 px-8">
							<NoBetsIcon class="w-52" />
							<div class="text-center text-lg font-bold">
								{#if me}
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
{/if}
