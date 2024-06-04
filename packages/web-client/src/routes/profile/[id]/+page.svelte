<script lang="ts">
import { page } from '$app/stores'
import Button from '@hnn/components/button/Button.svelte'
import IconButton from '@hnn/components/button/IconButton.svelte'
import ProfileLayout from '@hnn/components/web-client/layout/ProfileLayout.svelte'
import ProfilePosts from '$lib/components/profile/ProfilePosts.svelte'
import SpeculationPosts from '$lib/components/profile/SpeculationPosts.svelte'
import { registerEvent } from '@hnn/components/analytics/GA.utils'
import ProfileTabs from '@hnn/components/tabs/ProfileTabs.svelte'
import CopyButton from '@hnn/components/web-client/profile/CopyButton.svelte'
import ShowMoreButton from '@hnn/components/web-client/profile/ShowMoreButton.svelte'
import ReportPopup from '@hnn/components/popup/ReportPopup.svelte'
import Icon from '@hnn/components/icon/Icon.svelte'
import {
  doIFollowThisUser,
  loveUser,
  type PostPopulatedWithBetDetails,
} from '$lib/helpers/profile'
import goBack from '$lib/utils/goBack'
import { handleParams } from '$lib/utils/params'
import { getShortNumber } from '$lib/utils/shortNumber'
import { authState } from '$lib/stores/auth'
import { navigateBack } from '$lib/stores/navigation'
import { userProfile } from '$lib/stores/app'
import { onMount, tick } from 'svelte'
import { debounce } from 'throttle-debounce'
import type { PageData } from './$types'
import type { PostDetailsForFrontend } from '@hnn/declarations/individual_user_template/individual_user_template.did'
import { slide } from 'svelte/transition'
import type { Snapshot } from './$types'
import { serializeBigIntHelper } from '$lib/utils/Log'
import { reportPostOrUser } from '$lib/helpers/report'
import { showMigrationPopup } from '$lib/stores/popups'

export let data: PageData
export const snapshot: Snapshot = {
  capture: () => ({
    posts: JSON.stringify(posts, serializeBigIntHelper),
    scrollY,
  }),
  restore: async (value) => {
    posts = JSON.parse(value.posts)
    await tick()
    scrollEl.scrollTop = value.scrollY
  },
}

let { me, profile, canId } = data
let follow = {
  doIFollow: false,
  error: false,
  loading: true,
}
let posts: {
  profile: {
    posts: PostDetailsForFrontend[]
    noMorePosts: boolean
    fetchedCount: number
  }
  speculation: {
    posts: PostPopulatedWithBetDetails[]
    noMorePosts: boolean
    fetchedCount: number
  }
} = {
  profile: {
    posts: data.posts ?? [],
    noMorePosts: false,
    fetchedCount: 0,
  },
  speculation: {
    posts: [],
    noMorePosts: false,
    fetchedCount: 0,
  },
}
let scrollY = 0
let scrollEl: HTMLDivElement
let showMoreInfo = false
let showReportPopup = false

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

let selectedTab: 'posts' | 'speculations' = 'posts'

async function handleLove() {
  if (!profile.principal_id) return
  if (!$authState.isLoggedIn) {
    $authState.showLogin = true
    return
  }
  follow.loading = true
  const res = await loveUser(profile.principal_id)
  if (res) {
    if (follow.doIFollow) {
      profile.followers_count--
    } else {
      profile.followers_count++
    }
    profile = profile
    follow.doIFollow = !follow.doIFollow
  }
  follow.loading = false
}

const checkIFollowThisUser = debounce(200, async () => {
  follow.doIFollow = await doIFollowThisUser(profile.principal_id)
  follow.loading = false
})

onMount(() => {
  if (!me && $authState.isLoggedIn) {
    checkIFollowThisUser()
  } else follow.loading = false

  registerEvent(me ? 'view_my_profile' : 'view_profile', {
    userId: $userProfile.principal_id,
    profile_id: profile.principal_id,
    profile_canister_id: canId,
    profile_username: profile.unique_user_name,
  })
  handleParams()
  $showMigrationPopup = true
})

$: tab = $page.url.searchParams.get('tab')
$: selectedTab = tab === 'speculations' ? 'speculations' : 'posts'

function handleScroll() {
  scrollY = scrollEl?.scrollTop
}
</script>

<svelte:head>
  <title>{me ? 'Your' : "User's"} Videos | Hot or Not</title>
</svelte:head>

{#if showReportPopup}
  <ReportPopup
    bind:show={showReportPopup}
    type="profile"
    on:report={({ detail }) => reportPostOrUser(detail)}
    reportData={{
      userId: profile.principal_id || '',
      reportedByUserId: $authState.idString || '2vxsx-fae',
    }} />
{/if}

<ProfileLayout>
  <svelte:fragment slot="top-left">
    <IconButton
      iconName="caret-left"
      iconClass="h-7 w-7"
      on:click={() => goBack($navigateBack || '/menu', true)}
      class="shrink-0" />
  </svelte:fragment>
  <div slot="top-right" class="mt-0.5 flex shrink-0 items-center space-x-6">
    <IconButton
      iconName="share"
      iconClass="h-6 w-6"
      on:click={showShareDialog} />
    {#if me}
      <IconButton
        iconName="pencil"
        iconClass="h-5 w-5"
        href={`/profile/${userId}/edit`} />
    {:else if profile.principal_id}
      <IconButton
        iconName="report"
        iconClass="h-5 w-5"
        on:click={() => (showReportPopup = true)} />
    {/if}
  </div>
  <div slot="top-center" class="text-lg font-bold">
    {#if me}
      Your profile
    {/if}
  </div>

  <div
    bind:this={scrollEl}
    on:scroll={handleScroll}
    class="hide-scrollbar h-full w-full overflow-y-auto"
    slot="content">
    <div class="mx-auto flex max-w-5xl flex-col">
      <div class="flex w-full flex-col items-center justify-center py-8">
        <img
          class="h-24 w-24 rounded-full"
          alt={profile.display_name}
          src={profile.profile_picture_url} />
        <span class="text-md pt-4 font-bold">
          {profile.display_name}
        </span>
        <div class="flex items-center space-x-2 px-2 text-sm md:px-12">
          <span class="text-white">
            {`@${profile.unique_user_name}`}
          </span>
          {#if !profile.is_migrated}
            <div class="h-1 w-1 rounded-full bg-white" />
            <span class="text-primary">
              {getShortNumber(profile.profile_stats.lifetime_earnings)} Earnings
            </span>
          {/if}
          {#if me}
            <ShowMoreButton bind:show={showMoreInfo} class="hidden md:block" />
          {/if}
        </div>
        {#if me}
          <ShowMoreButton
            bind:show={showMoreInfo}
            class="my-1 block md:hidden" />
          {#if showMoreInfo}
            <div
              transition:slide
              class="mt-6 flex flex-col gap-4 rounded-md bg-white/5 p-8">
              <div class="flex items-center justify-between space-x-8">
                <div class="flex flex-col">
                  <span class="text-sm">Principal ID:</span>
                  <span class="text-xs text-white/70">
                    {$authState.idString}
                  </span>
                </div>
                <CopyButton textToCopy={$authState.idString} />
              </div>
              <div class="flex items-center justify-between space-x-8">
                <div class="flex flex-col">
                  <span class="text-sm">Canister ID:</span>
                  <span class="text-xs text-white/70">
                    {$authState.userCanisterId}
                  </span>
                </div>
                <CopyButton textToCopy={$authState.userCanisterId} />
              </div>
            </div>
          {/if}
        {/if}
      </div>
      {#if !profile.is_migrated}
        <div
          class="mx-4 flex items-center justify-center divide-x-2 divide-white/20 rounded-full bg-white/10 p-4">
          <a
            href={`/profile/${userId}/lovers`}
            class="flex flex-1 flex-col items-center space-y-0.5 px-2">
            <span class="whitespace-nowrap text-xl font-bold">
              {getShortNumber(profile.followers_count)}
            </span>
            <span class="text-sm">Lovers</span>
          </a>
          <a
            href={`/profile/${userId}/loving`}
            class="flex flex-1 flex-col items-center space-y-0.5 px-2">
            <span class="whitespace-nowrap text-xl font-bold">
              {getShortNumber(profile.following_count)}
            </span>
            <span class="text-sm">Loving</span>
          </a>
          <div class="flex flex-1 flex-col items-center space-y-0.5 px-2">
            <span class="whitespace-nowrap text-xl font-bold">
              {getShortNumber(profile.profile_stats.hots_earned_count)}
            </span>
            <span class="text-sm">Hots</span>
          </div>
          <div class="flex flex-1 flex-col items-center space-y-0.5 px-2">
            <span class="whitespace-nowrap text-xl font-bold">
              {getShortNumber(profile.profile_stats.nots_earned_count)}
            </span>
            <span class="text-sm">Nots</span>
          </div>
        </div>
        {#if !me}
          <div
            class="flex w-full items-center justify-between space-x-2 px-6 pt-6">
            <Button
              type={follow.doIFollow ? 'secondary' : 'primary'}
              disabled={follow.loading}
              on:click={handleLove}
              class="mx-auto w-[10rem]">
              {#if follow.loading}
                <Icon
                  name="loading"
                  class="h-6 w-6 animate-spin-slow text-white" />
              {:else}
                {follow.doIFollow ? 'Loving' : 'Love'}
              {/if}
            </Button>
            <!-- <Button type="secondary" class="w-full">Send tokens</Button> -->
          </div>
        {/if}
        <div class="px-6 pt-2">
          <ProfileTabs bind:selectedTab />
        </div>
        <div class="flex h-full flex-col px-6 py-6">
          {#if selectedTab === 'posts'}
            <ProfilePosts
              bind:posts={posts.profile.posts}
              bind:noMorePosts={posts.profile.noMorePosts}
              bind:fetchedCount={posts.profile.fetchedCount}
              {me}
              userId={$page.params.id} />
          {:else if selectedTab === 'speculations'}
            <SpeculationPosts
              bind:posts={posts.speculation.posts}
              bind:noMorePosts={posts.speculation.noMorePosts}
              bind:fetchedCount={posts.speculation.fetchedCount}
              {me}
              userId={$page.params.id} />
          {/if}
        </div>
      {:else}
        <div
          class="flex h-full w-full flex-col items-center justify-center !border-0 text-center">
          Your account has been transferred to yral.
          <br />
          Go ahead and explore the app
          <a
            target="_blank"
            class="font-bold text-[#E2017B] underline"
            href="https://yral.com">
            yral.com
          </a>
        </div>
      {/if}
    </div>
  </div>
</ProfileLayout>
