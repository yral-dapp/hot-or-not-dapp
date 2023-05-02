<script lang="ts">
import Button from '$components/button/Button.svelte'
import Coin3dIcon from '$components/icons/Coin3dIcon.svelte'
import CoinBagIcon from '$components/icons/CoinBagIcon.svelte'
import InfoIcon from '$components/icons/InfoIcon.svelte'
import TrophyIcon from '$components/icons/TrophyIcon.svelte'
import UsersIcon from '$components/icons/UsersIcon.svelte'
import Input from '$components/input/Input.svelte'
import { confetti } from '@neoconfetti/svelte'

export let participated = false
let loading = true
const backgroundUrl =
  'https://miro.medium.com/v2/resize:fit:4800/format:webp/1*JCirrVIiqLPa14NEBRx_6A.jpeg'
const rewardTierUrl = 'https://app.questn.com/quest/762209652021325987'
</script>

<waitlist-form class="relative mx-auto block w-full max-w-2xl">
  {#if participated}
    <div use:confetti class="absolute inset-0 h-1 w-1" />
  {/if}
  <div
    class="relative mx-auto flex w-fit flex-col items-center gap-4 rounded-md bg-center">
    <Coin3dIcon class="absolute -left-8 -top-4 h-5 w-5 rotate-[280deg]" />
    <Coin3dIcon class="absolute -right-8 -top-8 h-8 w-8 rotate-[15deg]" />
    <Coin3dIcon class="absolute -left-14 bottom-0 h-10 w-10 rotate-[15deg]" />
    <Coin3dIcon class="absolute -right-4 bottom-0 h-6 w-6 rotate-[320deg]" />
    <span class="text-xl font-bold">Hot or Not's</span>
    <span class="text-5xl font-bold text-primary">$ 250,000</span>
    <span class="text-xl font-bold">Airdrop is here</span>
  </div>
  <div class="flex flex-col gap-8 p-3 !pt-8 md:p-8">
    {#if !participated}
      <div class="text-sm">
        <span>
          Hot or Not is all set to take over TikTok and we are taking you along
          with us. Fill out the form below to register for our pre-SNS airdrop!
        </span>
        <br />
        <br />
        <span>
          Learn about our reward tires at
          <a href={rewardTierUrl} class="text-primary">{rewardTierUrl}</a>
        </span>
      </div>
      <div class="flex flex-col gap-2">
        <span class="text-md text-white">Email:</span>
        <Input
          placeholder="Enter your email"
          class="flex-1 rounded-md border-0 bg-white/10 p-2 outline-none ring-0 focus:border-0 focus:outline-none focus:ring-0" />
      </div>
      <div class="flex flex-col gap-2">
        <span class="text-md text-white">Tweet Link:</span>
        <div class="flex items-start gap-1 text-white/70">
          <span class="shrink-0 pt-0.5">
            <InfoIcon class="h-4 w-4" />
          </span>
          <span class="text-sm">
            You need to tweet with the hashtag #hotornot and paste your tweet's
            link
          </span>
        </div>
        <Input
          placeholder="Enter your tweet link"
          class="flex-1 rounded-md border-0 bg-white/10 p-2 outline-none ring-0 focus:border-0 focus:outline-none focus:ring-0" />
      </div>
      <div class="flex flex-col gap-2">
        <span class="text-md text-white">Connect NNS ID:</span>
        <div class="flex items-start gap-1 text-white/70">
          <span class="shrink-0 pt-0.5">
            <InfoIcon class="h-4 w-4" />
          </span>
          <span class="text-sm">
            You need to connect your wallet for airdrop tokens
          </span>
        </div>
        <Button type="secondary" class="rounded-lg bg-black/30">
          Connect to Wallet
        </Button>
      </div>
      <div>
        <span class="text-sm text-white/70">
          Note: Every email ID can only be associated with one login account. If
          the same email is used with multiple airdrop entries, the previous
          entries will be overwritten
        </span>
      </div>
      <div class="">
        <Button on:click={() => (participated = true)} class="w-full">
          Join Waitlist
        </Button>
      </div>
      <div class="text-center text-xs text-white/70">
        By joining, you agree to
        <a
          class="underline"
          href="/terms-of-service"
          target="_blank"
          rel="noopener noreferrer">
          terms of service
        </a>
        &amp;
        <a
          class="underline"
          href="/privacy-policy"
          target="_blank"
          rel="noopener noreferrer">
          privacy policy
        </a>
      </div>
    {:else}
      <div class="text-2xl font-bold md:text-4xl">
        🎉 You're on the waitlist!
      </div>
      <div class="flex items-center justify-between">
        <div class="flex flex-col items-center gap-2 p-8 text-white">
          <TrophyIcon class="h-8 w-8" />
          <span class="text-sm">Position</span>
          <span class="text-lg font-bold">#4</span>
        </div>
        <div class="flex flex-col items-center gap-2 p-8 text-white">
          <CoinBagIcon class="h-8 w-8" />
          <span class="text-sm">Points</span>
          <span class="text-lg font-bold">30</span>
        </div>
        <div class="flex flex-col items-center gap-2 p-8 text-white">
          <UsersIcon class="h-8 w-8" />
          <span class="text-sm">Referrals</span>
          <span class="text-lg font-bold">2</span>
        </div>
      </div>
    {/if}
  </div>
</waitlist-form>
