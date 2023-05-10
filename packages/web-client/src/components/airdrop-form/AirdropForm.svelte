<script lang="ts">
import Button from '$components/button/Button.svelte'
import Coin3dIcon from '$components/icons/Coin3dIcon.svelte'
import CoinBagIcon from '$components/icons/CoinBagIcon.svelte'
import InfoIcon from '$components/icons/InfoIcon.svelte'
import TrophyIcon from '$components/icons/TrophyIcon.svelte'
import UsersIcon from '$components/icons/UsersIcon.svelte'
import Input from '$components/input/Input.svelte'
import DotSeparator from '$components/layout/DotSeparator.svelte'
import { fetchTokenBalance } from '$lib/helpers/profile'
import { authState } from '$stores/auth'
import { confetti } from '@neoconfetti/svelte'
import OptionalInput from './OptionalInput.svelte'

export let participated = false
let wallet = {
  balance: 0,
  loading: true,
  error: false,
}

async function refreshTokenBalance() {
  wallet.loading = true
  wallet.error = false
  const res = await fetchTokenBalance()
  if (res.error) {
    wallet.error = true
  } else {
    wallet.balance = res.balance
  }
  wallet.loading = false
}

let loading = true
let checked = false
const backgroundUrl =
  'https://miro.medium.com/v2/resize:fit:4800/format:webp/1*JCirrVIiqLPa14NEBRx_6A.jpeg'

$: $authState.isLoggedIn && refreshTokenBalance()
</script>

<waitlist-form class="relative mx-auto block w-full max-w-2xl">
  {#if participated}
    <div use:confetti class="absolute inset-0 h-1 w-1" />
  {/if}
  <div
    class="relative mx-auto flex w-fit flex-col items-center gap-4 rounded-md bg-center">
    <Coin3dIcon class="absolute -left-4 -top-4 h-5 w-5 rotate-[280deg]" />
    <Coin3dIcon class="absolute -top-4 right-0 h-8 w-8 rotate-[15deg]" />
    <Coin3dIcon class="absolute -left-10 bottom-0 h-10 w-10 rotate-[15deg]" />
    <Coin3dIcon class="absolute -right-4 bottom-0 h-6 w-6 rotate-[320deg]" />
    <span class="text-xl font-bold">Hot or Not's</span>
    <span class="text-5xl font-bold text-primary">
      $ 250,000 <sub class="align-super text-white">*</sub>
    </span>
    <span class="text-xl font-bold">Airdrop is here</span>
  </div>
  <div class="flex flex-col gap-8 p-3 !pt-8 md:p-8">
    {#if !participated}
      <div class="text-sm">
        <span>
          Join us at Hot or Not as we take over TikTok! Register for the
          whitelist to receive "HOT" governance tokens in our decentralization
          sale.
        </span>
        <br />
        <br />
        <a href="/airdrop-guide" class="text-primary underline">
          Learn more about the airdrop here
        </a>
      </div>
      <DotSeparator />
      <div class="flex flex-col gap-2 text-sm">
        <span class="font-bold text-primary">Your Hot or Not Principal ID</span>
        <span>{$authState.idString}</span>
      </div>
      <div class="flex flex-col gap-2 text-sm">
        <span class="font-bold text-primary">Your Current Wallet Balance</span>
        {#if wallet.error}
          <div>
            <button
              class="mx-2 inline rounded-sm bg-primary px-2 py-1 outline-1 outline-white">
              Reload
            </button>
            <span class="text-red-700">Error fetching balance.</span>
          </div>
        {:else if wallet.loading}
          <pre class="text-xs">Loading ...</pre>
        {:else}
          <span>{wallet.balance} Coyns</span>
          <span class="text-xs text-white/70">
            Note: final balance at the end of 30 days will be considered for
            airdrop allotment
          </span>
        {/if}
      </div>
      <div class="flex flex-col gap-2">
        <span class="text-sm text-white">
          Email
          <sub class="align-super text-primary">*</sub>
        </span>
        <Input
          placeholder="Enter your email"
          class="flex-1 rounded-md border-0 bg-white/10 p-2 text-sm outline-none ring-0 focus:border-0 focus:outline-none focus:ring-0" />
      </div>
      <div class="flex flex-col gap-2">
        <span class="text-sm text-white">
          Tweet Link
          <sub class="align-super text-primary">*</sub>
        </span>
        <div class="flex items-start gap-1 text-white/70">
          <span class="shrink-0 pt-0.5">
            <InfoIcon class="h-3 w-3" />
          </span>
          <span class="text-xs">
            You need to tweet with the hashtag #hotornot and paste your tweet's
            link
          </span>
        </div>
        <Input
          placeholder="Enter your tweet link"
          class="flex-1 rounded-md border-0 bg-white/10 p-2 text-sm outline-none ring-0 focus:border-0 focus:outline-none focus:ring-0" />
      </div>
      <div class="flex flex-col gap-2">
        <span class="text-sm text-white">
          Do you own any of the following assets? Please select all that apply:
        </span>
        <OptionalInput
          checkboxLabel="SNS-1 Token"
          inputLabel="Please submit your NNS principal ID"
          inputPlaceholder="Enter Principal ID" />
        <OptionalInput
          checkboxLabel="Chat Token"
          inputLabel="Please submit your NNS principal ID"
          inputPlaceholder="Enter Principal ID" />
        <OptionalInput
          checkboxLabel="Hot or Not Funded NFT"
          inputLabel="Please submit your Plug wallet principal ID"
          inputPlaceholder="Enter Principal ID" />
        <OptionalInput
          checkboxLabel="Gob-Gob NFT"
          inputLabel="Please submit your Plug wallet principal ID"
          inputPlaceholder="Enter Principal ID" />
      </div>
      <div class="text-xs text-white/70">
        Note: Every email ID can only be associated with one login account. If
        the same mail is used with multiple airdrop entries, the previous
        entries will be overwritten
      </div>
      <div class="text-xs text-white/70">
        <span class="text-lg">*</span>
        Subject to full SNS subscription & ICP price
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
