<script lang="ts">
import Button from '$components/button/Button.svelte'
import InfoIcon from '$components/icons/InfoIcon.svelte'
import LoadingIcon from '$components/icons/LoadingIcon.svelte'
import Input from '$components/input/Input.svelte'
import DotSeparator from '$components/layout/DotSeparator.svelte'
import LoginButton from '$components/login/LoginButton.svelte'
import {
  airdropEntryDetails,
  isNNSIdRegistered,
  registerNNSId,
} from '$lib/helpers/airdrop'
import { isPrincipal } from '$lib/utils/isPrincipal'
import { authState } from '$stores/auth'
import { loadingAuthStatus } from '$stores/loading'
import AirdropCompleted from './AirdropCompleted.svelte'

let wallet = {
  coyn: '0',
  hot: 0,
  loading: true,
}

let loading = true
let participatedForNNS = false
let participatedForAirdrop = false

async function checkIfCompleted() {
  if ($authState.idString) {
    const res = await airdropEntryDetails($authState.idString)
    if (!res) {
      participatedForAirdrop = false
    } else {
      wallet.coyn = res?.FinalCOYNWalletBalance
      wallet.hot = res?.FinalHotTokens
      wallet.loading = false
      participatedForAirdrop = true
      participatedForNNS = await isNNSIdRegistered($authState.idString)
    }
  }
  loading = false
}

$: authorized = $authState.isLoggedIn && !$loadingAuthStatus
$: authorized && checkIfCompleted()

let formErrors: string[] = []
let formLoading = false
let nnsValue = ''

async function saveFormData() {
  try {
    formLoading = true
    const res = await registerNNSId({
      principalId: $authState.idString || '',
      canisterId: $authState.userCanisterId || '',
      nnsId: nnsValue,
    })
    if (!res) throw 'Something went wrong'
    formLoading = false
    participatedForNNS = true
  } catch (e) {
    console.error('Failed while saving data', e)
    formLoading = false
    formErrors = ['Could not join waitlist. Please try again.']
  }
}

async function validateData() {
  if (formLoading) return
  formLoading = true
  formErrors = []

  if (wallet.loading) {
    formErrors = ['Could not fetch wallet balance. Please refresh the page']
    return
  }

  if (nnsValue.trim()) {
    const principal = nnsValue.trim()
    if (!isPrincipal(principal)) {
      formErrors.push('NNS Principal ID is invalid')
    }
  }

  formErrors = formErrors
  if (formErrors.length === 0) {
    await saveFormData()
  }
  formLoading = false
}
</script>

<waitlist-form class="relative mx-auto block w-full max-w-2xl">
  <div class="flex flex-col gap-8 p-3 !pt-8 md:p-8">
    {#if participatedForAirdrop && !participatedForNNS}
      <div class="mx-auto pt-16 text-center text-sm">
        <div>
          Your HOT token airdrop allocation has been determined. Please submit
          your NNS Principal ID to start the claim process and become a part of
          the HotorNot team!
        </div>
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
      <div class="flex w-full justify-center pt-8">
        <LoadingIcon class="h-8 w-8 animate-spin-slow" />
      </div>
    {:else if participatedForAirdrop && !participatedForNNS}
      <div class="flex flex-col gap-2 text-sm">
        <span class="font-bold text-primary">Your Hot or Not Principal ID</span>
        <span>{$authState.idString}</span>
      </div>

      <div class="flex flex-col gap-2 text-sm">
        <span class="font-bold text-primary">Your Final Wallet Balance</span>

        {#if wallet.loading}
          <pre class="text-xs">Loading ...</pre>
        {:else}
          <span>{wallet.coyn} Coyns</span>
          <span class="text-xs text-white/70">
            Note: The amount mentioned above represents the sum of your final
            wallet balance on 15th July 2023, along with the extra COYNs awarded
            for holding CHAT tokens, SNS-1 tokens, DSCVR Principal ID, GobGobs,
            and Funded NFTs.
          </span>
        {/if}
      </div>
      <div class="flex flex-col gap-2 text-sm">
        <span class="font-bold text-primary">
          Your HOT token airdrop allotment
        </span>
        <span>{wallet.hot} HOT Tokens</span>
        <span class="text-xs text-white/70">
          Note: Please refer the Airdrop Guide for details on how the HOT token
          reward is calculated.
        </span>
      </div>
      <div class="flex flex-col gap-2">
        <span class="text-sm text-white">
          Please submit you NNS Principal ID:
          <sub class="align-super text-primary">*</sub>
        </span>

        <Input
          bind:value={nnsValue}
          placeholder="Enter NNS Principal ID"
          class="flex-1 rounded-md border-0 bg-white/10 p-2 text-sm outline-none ring-0 focus:border-0 focus:outline-none focus:ring-0" />
      </div>

      {#if formErrors.length}
        <div class="flex flex-col gap-1">
          <span>Error(s):</span>
          {#each formErrors as err, i (i)}
            <li class="text-xs text-red-600">{err}</li>
          {/each}
        </div>
      {/if}
      <div class="text-white/70">
        <span class="text-xs">
          Note: The HOT tokens will be transferred to your NNS wallet by our
          team over the course of a few months as we go through the process
          manually with over 16,000 winners. Please be patient and check our
          socials for updates.
        </span>
      </div>
      <div>
        <Button
          disabled={formLoading}
          on:click={() => validateData()}
          class="w-full">
          {#if formLoading}
            <LoadingIcon class="h-6 w-6 animate-spin-slow" />
          {:else}
            Submit
          {/if}
        </Button>
      </div>
    {:else if !participatedForAirdrop}
      <div class="mx-auto pt-32 text-center text-sm">
        <div>Airdrop Registration Has Ended</div>
        <div>
          Thank you for your interest! We are no longer accepting new
          registrations.
        </div>
        <br />
        <a href="/airdrop-guide" class="text-primary underline">
          Learn more about the airdrop here
        </a>
      </div>
      <Button href="/hotornot" class="w-full">Play to earn</Button>
    {:else}
      <div class="flex h-full w-full flex-col items-center overflow-hidden">
        <AirdropCompleted />
      </div>
    {/if}
  </div>
</waitlist-form>
