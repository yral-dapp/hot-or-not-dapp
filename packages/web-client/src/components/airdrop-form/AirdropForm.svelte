<script lang="ts">
import Button from '$components/button/Button.svelte'
import Coin3dIcon from '$components/icons/Coin3dIcon.svelte'
import InfoIcon from '$components/icons/InfoIcon.svelte'
import LoadingIcon from '$components/icons/LoadingIcon.svelte'
import Input from '$components/input/Input.svelte'
import DotSeparator from '$components/layout/DotSeparator.svelte'
import LoginButton from '$components/login/LoginButton.svelte'
import { isFormFilled } from '$lib/helpers/firebase'
import { fetchTokenBalance } from '$lib/helpers/profile'
import { authState } from '$stores/auth'
import { loadingAuthStatus } from '$stores/loading'
import AirdropCompleted from './AirdropCompleted.svelte'
import OptionalInput from './OptionalInput.svelte'

let wallet = {
  balance: 0,
  loading: true,
  error: false,
}
let loading = false
let participated = false

async function checkIfCompleted() {
  if ($authState.idString) {
    participated = await isFormFilled($authState.idString)
    // participated = await isFormFilled('1234')
  }
  loading = false
}

async function refreshTokenBalance() {
  console.log('checlking balance')
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

$: authorized = $authState.isLoggedIn && !$loadingAuthStatus
$: if (!$loadingAuthStatus) {
  if (!$authState.isLoggedIn) {
    checkIfCompleted()
  } else {
    loading = false
  }
}
$: authorized && !participated && refreshTokenBalance()
</script>

<waitlist-form class="relative mx-auto block w-full max-w-2xl">
  <div class="flex flex-col gap-8 p-3 !pt-8 md:p-8">
    {#if !participated}
      <div
        class="relative mx-auto flex w-fit flex-col items-center gap-4 rounded-md bg-center">
        <Coin3dIcon class="absolute -left-4 -top-4 h-5 w-5 rotate-[280deg]" />
        <Coin3dIcon class="absolute -top-4 right-0 h-8 w-8 rotate-[15deg]" />
        <Coin3dIcon
          class="absolute -left-10 bottom-0 h-10 w-10 rotate-[15deg]" />
        <Coin3dIcon
          class="absolute -right-4 bottom-0 h-6 w-6 rotate-[320deg]" />
        <span class="text-xl font-bold">Hot or Not's</span>
        <span class="text-5xl font-bold text-primary">
          $ 250,000 <sub class="align-super text-white">*</sub>
        </span>
        <span class="text-xl font-bold">Airdrop is here</span>
      </div>
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
    {/if}

    {#if !authorized}
      <div class="flex w-full justify-center">
        <LoginButton />
      </div>
    {:else if loading}
      <LoadingIcon class="h-5 w-5 animate-spin-slow" />
    {:else if !participated}
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
      <div class="-mt-40 flex h-full w-full flex-col">
        <AirdropCompleted />
      </div>
    {/if}
  </div>
</waitlist-form>
