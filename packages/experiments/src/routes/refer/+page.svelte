<script lang="ts">
import { page } from '$app/stores'
import coinsStashImg from '$assets/coins-stash.webp'
import { registerEvent } from '$components/analytics/GA.utils'
import LoginButton from '$components/auth/LoginButton.svelte'
import Button from '$components/button/Button.svelte'
import IconButton from '$components/button/IconButton.svelte'
import Icon from '$components/icon/Icon.svelte'
import HomeLayout from '$components/layout/HomeLayout.svelte'
import { getDb } from '$lib/db'
import type { CollectionName, ReferralRecord } from '$lib/db/db.types'
import getDefaultImageUrl from '$lib/utils/getDefaultImageUrl'
import Log from '$lib/utils/Log'
import { generateRandomName } from '$lib/utils/randomUsername'
import { authState } from '$stores/auth'
import userProfile from '$stores/userProfile'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { onMount } from 'svelte'

let loading = true
let error = false
let history: ReferralRecord[] = []

const INVITE_WIN_TOKENS = 500

async function loadReferrals() {
  loading = true
  error = false
  const db = getDb()
  const refDocs = await getDocs(
    query(
      collection(db, 'referrals' satisfies CollectionName),
      where('referred_by_uid', '==', $authState.userId),
    ),
  )

  if (!refDocs.empty) {
    refDocs.forEach((r) => history.push(r.data() as ReferralRecord))
  }
  loading = false
}

async function shareLink() {
  try {
    if (!navigator.share) {
      throw 'Share not supported'
    }
    await navigator.share({
      url: link,
    })
  } catch (e) {
    Log('warn', 'Could not share link', {
      error: e,
      from: 'refer-earn.shareLink',
    })
    copyLink()
  }
}

let copied = false

async function copyLink() {
  try {
    copied = false
    await navigator.clipboard.writeText(link)
    copied = true
  } catch (e) {
    Log('warn', 'Could not copy to clipboard', {
      error: e,
      from: 'refer-earn.copyLink',
    })
  }
}

onMount(() => {
  if ($authState.isLoggedIn) {
    loadReferrals()
    registerEvent('refer_earn_visit', {
      userId: $authState.userId,
      email: $userProfile.email,
    })
  }
})

$: link = !$authState.isLoggedIn
  ? ''
  : `https://${$page.url.host}/invite?userId=${$authState.userId}`
</script>

<svelte:head>
  <title>Refer & Earn | Hot or Not</title>
</svelte:head>

<HomeLayout>
  <svelte:fragment slot="top">
    <div
      class="flex w-full items-center justify-center bg-black py-4 shadow-xl shadow-black/50">
      Refer & Earn
      <div class="absolute left-4 top-4">
        <IconButton
          iconName="caret-left"
          iconClass="h-7 w-7"
          href="/up-down"
          class="shrink-0" />
      </div>
    </div>
  </svelte:fragment>
  <svelte:fragment slot="content">
    <div
      class="flex h-full w-full flex-col items-center space-y-4 overflow-hidden overflow-y-scroll px-8 pb-20 pt-16">
      <div class="shrink-0 py-4">
        <img src={coinsStashImg} class="h-36 select-none" alt="Coins stash" />
      </div>
      <div class="shrink-0 text-center text-2xl font-bold">
        Invite & Win {INVITE_WIN_TOKENS} tokens
      </div>
      {#if $authState.isLoggedIn}
        <div class="shrink-0 text-center text-sm opacity-70">
          Send a referral link to your friends via link/whatsapp and win tokens
        </div>
        <div class="pt-8 text-sm uppercase">referral link</div>
        <div
          class="relative flex w-full shrink-0 items-center justify-between overflow-hidden truncate rounded-full border-2 border-dashed border-primary px-6 py-5 pr-10">
          <span
            role="presentation"
            on:click={copyLink}
            class="w-full select-all truncate whitespace-nowrap text-xs font-thin">
            {link}
          </span>

          <div class="absolute right-0 bg-black px-3">
            <IconButton
              iconName="copy"
              iconClass="h-5 w-5 pr-1"
              on:click={shareLink} />
          </div>
        </div>
        {#if copied}
          <div class="text-xs text-primary">Link copied</div>
        {/if}
      {:else}
        <div class="text-center text-sm opacity-70">
          Please login to see your referral link
        </div>
        <div class="flex h-24 w-full items-center justify-center">
          <Button on:click={() => ($authState.showLogin = true)} class="w-full">
            Login
          </Button>
        </div>
      {/if}
      <div class="pb-4 pt-8">How does it work?</div>
      <div class="flex items-center space-x-8">
        <div class="flex flex-col items-center space-y-3">
          <div
            class="flex h-12 w-12 items-center justify-center rounded-sm bg-white/10">
            <Icon name="share" class="h-5 w-5 text-primary" />
          </div>
          <span class="text-center text-xs">Share your link with a friend</span>
        </div>
        <div class="flex flex-col items-center space-y-3">
          <div
            class="flex h-12 w-12 items-center justify-center rounded-sm bg-white/10">
            <Icon name="cloud-download" class="h-5 w-5 text-primary" />
          </div>
          <span class="text-center text-xs">
            Your friends downloads and logs into the app
          </span>
        </div>
        <div class="flex flex-col items-center space-y-3">
          <div
            class="flex h-12 w-12 items-center justify-center rounded-sm bg-white/10">
            <Icon name="coin-dollar" class="h-5 w-5 text-primary" />
          </div>
          <span class="text-center text-xs">
            You both win {INVITE_WIN_TOKENS} tokens each
          </span>
        </div>
      </div>
      {#if $authState.isLoggedIn}
        {#each history as item, i}
          {@const date = new Date(item.created_at).toDateString().substring(4)}
          <div class="flex w-full items-center justify-between py-2 text-white">
            <div class="flex items-center space-x-8">
              <img
                src={getDefaultImageUrl(i.toString())}
                alt="avatar"
                class="h-12 w-12 rounded-full object-cover" />
              <div class="flex flex-col items-start">
                <span>{generateRandomName('name', i.toString())}</span>
                <span class="text-sm text-white/50">{date}</span>
              </div>
            </div>
            <span>{item.amount} Coins</span>
          </div>
        {/each}
        {#if loading}
          <div class="text-center text-sm opacity-70">Loading</div>
        {:else if error}
          <div class="text-center text-sm text-red-500">
            Error fetching history.
          </div>
        {:else if !history.length}
          <div class="text-center text-sm opacity-70">No referrals yet.</div>
        {/if}
      {:else}
        <div class="text-center text-sm opacity-70">
          Please login to see your referral history
        </div>
        <LoginButton />
      {/if}
    </div>
  </svelte:fragment>
</HomeLayout>
