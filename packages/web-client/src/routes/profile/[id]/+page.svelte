<script lang="ts">
import IconButton from '$components/button/IconButton.svelte'
import CaretLeftIcon from '$components/icons/CaretLeftIcon.svelte'
import PencilIcon from '$components/icons/PencilIcon.svelte'
import ProfileLayout from '$components/layout/ProfileLayout.svelte'
import ShareArrowIcon from '$components/icons/ShareArrowIcon.svelte'
import ProfileTabs from '$components/tabs/ProfileTabs.svelte'
import ProfilePost from '$components/profile/ProfilePost.svelte'
import NoBetsIcon from '$components/icons/NoBetsIcon.svelte'
import NoPostsIcon from '$components/icons/NoPostsIcon.svelte'
import Button from '$components/button/Button.svelte'
import ReportIcon from '$components/icons/ReportIcon.svelte'
import SpeculationPost from '$components/profile/SpeculationPost.svelte'
import userProfile from '$stores/userProfile'
import { onMount } from 'svelte'
import type { PageData } from './$types'
import navigateBack from '$stores/navigateBack'
import { page } from '$app/stores'
import { doIFollowThisUser, fetchPosts, loveUser } from '$lib/helpers/profile'
import Log from '$lib/utils/Log'
import type { PostDetailsForFrontend } from '$canisters/individual_user_template/individual_user_template.did'
import LoadingIcon from '$components/icons/LoadingIcon.svelte'
import { getThumbnailUrl } from '$lib/utils/cloudflare'
import IntersectionObserver from '$components/intersection-observer/IntersectionObserver.svelte'
import { registerEvent } from '$components/seo/GA.svelte'
import { handleParams } from '$lib/utils/params'
import { authState } from '$stores/auth'

export let data: PageData
let { me, profile, canId } = data

let load = {
  page: true,
  posts: false,
  follow: false,
}

const speculations: any = []

let fetchedPosts: PostDetailsForFrontend[] = []
let errorWhileFetching = false
let noMorePosts = false
let fetchedPostsCount = 0
let doIFollow = true

$: userId = profile?.username_set
  ? profile?.unique_user_name
  : profile?.principal_id || $page.params.id

async function showShareDialog() {
  try {
    await navigator.share({
      title: 'Hot or Not',
      text: `Check out my profile: ${profile.display_name} ${
        profile.username_set ? '(@' + profile.unique_user_name + ')' : ''
      }`,
      url: `https://hotornot.wtf/profile/${userId}`,
    })
  } catch (_) {}
  registerEvent(me ? 'share_my_profile' : 'share_profile', {
    userId: $userProfile.principal_id,
    profile_canister_id: canId,
    profile_id: profile.principal_id,
    profile_username: profile.unique_user_name,
  })
}

let selectedTab: 'posts' | 'trophy' = 'posts'

async function handleLove() {
  if (!profile.principal_id) return
  if (!$authState.isLoggedIn) {
    $authState.showLogin = true
    return
  }
  load.follow = true
  const res = await loveUser(profile.principal_id)
  if (res) {
    if (doIFollow) {
      profile.followers_count--
    } else {
      profile.followers_count++
    }
    profile = profile
    doIFollow = !doIFollow
  }
  load.follow = false
}

async function loadPosts() {
  try {
    if (noMorePosts) {
      return
    }

    load.posts = true
    errorWhileFetching = false
    const res = await fetchPosts($page.params.id, fetchedPostsCount)

    if (res.error) {
      errorWhileFetching = true
      load.posts = false
      return
    }

    fetchedPosts.push(...res.posts)
    fetchedPosts = fetchedPosts
    noMorePosts = res.noMorePosts
    fetchedPostsCount = fetchedPosts.length
    load.posts = false
  } catch (e) {
    errorWhileFetching = true
    load.posts = false
    Log({ error: e, from: '1 loadPosts' }, 'error')
  }
}

onMount(async () => {
  if (!me) {
    doIFollow = await doIFollowThisUser(profile.principal_id, canId)
  }
  registerEvent(me ? 'view_my_profile' : 'view_profile', {
    userId: $userProfile.principal_id,
    profile_id: profile.principal_id,
    profile_canister_id: canId,
    profile_username: profile.unique_user_name,
  })
  load.page = false
  loadPosts()
  handleParams()
  Log({ from: '0 profileMount', id: $page.params.id, me, profile }, 'info')
})
</script>

<svelte:head>
  <title>{me ? 'Your' : "User's"} Videos | Hot or Not</title>
</svelte:head>

{#if !load.page}
  <ProfileLayout>
    <svelte:fragment slot="top-left">
      <IconButton
        href={$navigateBack && !$navigateBack.includes('edit')
          ? $navigateBack
          : '/feed'}
        class="shrink-0">
        <CaretLeftIcon class="h-7 w-7" />
      </IconButton>
    </svelte:fragment>
    <div slot="top-right" class="mt-0.5 flex shrink-0 items-center space-x-6">
      <IconButton on:click={showShareDialog}>
        <ShareArrowIcon class="h-6 w-6" />
      </IconButton>
      {#if me}
        <IconButton href={`/profile/${userId}/edit`}>
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
            alt={profile.display_name}
            src={profile.profile_picture_url} />
          <span class="text-md pt-4 font-bold">
            {profile.display_name}
          </span>
          <span class="px-12 text-center text-sm">
            {profile.username_set
              ? `@${profile.unique_user_name}`
              : profile.principal_id}
          </span>
        </div>
        <div
          class="mx-4 flex items-center justify-center divide-x-2 divide-white/20 rounded-full bg-white/10 p-4">
          <a
            href={`/profile/${userId}/lovers`}
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
          <div
            class="flex w-full items-center justify-between space-x-2 px-6 pt-6">
            <Button
              type={doIFollow ? 'secondary' : 'primary'}
              disabled={load.follow}
              on:click={handleLove}
              class="mx-auto w-[10rem]">
              {doIFollow ? 'Loving' : 'Love'}
            </Button>
            <!-- <Button type="secondary" class="w-full">Send tokens</Button> -->
          </div>
        {/if}
        <div class="px-6 pt-2">
          <ProfileTabs bind:selected={selectedTab} />
        </div>
        <div class="flex h-full flex-col px-6 py-6">
          {#if selectedTab === 'posts'}
            {#if fetchedPosts.length}
              <div class="grid grid-cols-3 gap-3">
                {#each fetchedPosts as post}
                  <ProfilePost
                    id={Number(post.id)}
                    views={Number(post.total_view_count)}
                    likes={Number(post.like_count)}
                    imageBg={getThumbnailUrl(post.video_uid)} />
                {/each}
              </div>
            {:else if !load.posts && !errorWhileFetching}
              <div
                class="flex h-full w-full flex-col items-center justify-center space-y-8 px-8">
                <NoPostsIcon class="w-52" />
                <div class="text-center text-lg font-bold">
                  {#if me}
                    You have not uploaded any videos yet
                  {:else}
                    This user has not uploaded any videos yet
                  {/if}
                </div>
                {#if me}
                  <Button href="/upload" preload class="w-full">
                    Upload your first video
                  </Button>
                {/if}
              </div>
            {/if}
            {#if errorWhileFetching}
              <div
                class="flex w-full flex-col items-center justify-center space-y-2 py-8 ">
                <div class="flex items-center space-x-2 text-sm text-red-500">
                  <ReportIcon class="h-4 w-4" />
                  <span>Error while fetching posts</span>
                </div>
                <Button
                  on:click={loadPosts}
                  type="secondary"
                  class="py-2 px-6 text-xs">
                  Try again
                </Button>
              </div>
            {:else if load.posts}
              <div
                class="flex w-full items-center justify-center space-x-2 py-8">
                <LoadingIcon class="h-4 w-4 animate-spin" />
                <span>Fetching posts</span>
              </div>
            {/if}
            {#if noMorePosts && fetchedPosts.length}
              <div
                class="flex w-full items-center justify-center space-x-2 py-8 opacity-40">
                <span>No more posts</span>
              </div>
            {/if}

            <IntersectionObserver
              on:intersected={loadPosts}
              threshold={0.1}
              disabled={load.posts || errorWhileFetching}
              intersect={!noMorePosts}>
              <svelte:fragment>
                <div class="h-4 w-full" />
              </svelte:fragment>
            </IntersectionObserver>
          {:else if speculations.length}
            <div class="grid grid-cols-2 gap-3">
              {#each speculations as speculation}
                <SpeculationPost {me} {...speculation} />
              {/each}
            </div>
          {:else}
            <div
              class="flex h-full w-full flex-col items-center justify-center space-y-8 px-8">
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
