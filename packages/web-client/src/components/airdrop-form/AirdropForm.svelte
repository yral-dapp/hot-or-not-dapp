<script lang="ts">
import Button from '$components/button/Button.svelte'
import Coin3dIcon from '$components/icons/Coin3dIcon.svelte'
import InfoIcon from '$components/icons/InfoIcon.svelte'
import LoadingIcon from '$components/icons/LoadingIcon.svelte'
import Input from '$components/input/Input.svelte'
import DotSeparator from '$components/layout/DotSeparator.svelte'
import LoginButton from '$components/login/LoginButton.svelte'
import {
  isFormFilled,
  uploadForm,
  type AirdropFormData,
} from '$lib/helpers/airdrop'
import { fetchTokenBalance } from '$lib/helpers/profile'
import { isPrincipal } from '$lib/utils/isPrincipal'
import { authState } from '$stores/auth'
import { loadingAuthStatus } from '$stores/loading'
import AirdropCompleted from './AirdropCompleted.svelte'
import OptionalInput from './OptionalInput.svelte'

let wallet = {
  balance: 0,
  loading: true,
  error: false,
}

let loading = true
let participated = false

const validationRegex = {
  url: /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
  email:
    /^(([a-zA-Z0-9]+)|([a-zA-Z0-9]+((?:\_[a-zA-Z0-9]+)|(?:\.[a-zA-Z0-9]+))*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-zA-Z]{2,6}(?:\.[a-zA-Z]{2})?)$)/,
}

function validateWithRegex(regex: 'url' | 'email', str: string) {
  return validationRegex[regex].test(str)
}

async function checkIfCompleted() {
  if ($authState.idString) {
    participated = await isFormFilled($authState.idString)
  }
  loading = false
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

$: authorized = $authState.isLoggedIn && !$loadingAuthStatus
$: authorized && checkIfCompleted()
$: authorized && !participated && refreshTokenBalance()

let formErrors: string[] = []
let formLoading = false

let formData: Omit<
  AirdropFormData,
  'principalId' | 'walletBalance' | 'canisterId'
> = {
  email: '',
  tweetLink: '',
  sns1Token: {
    checked: false,
    principalId: '',
  },
  chatToken: {
    checked: false,
    principalId: '',
  },
  fundedNft: {
    checked: false,
    principalId: '',
  },
  gobGobNft: {
    checked: false,
    principalId: '',
  },
}

async function saveFormData() {
  try {
    formLoading = true
    const res = await uploadForm({
      principalId: $authState.idString || '',
      walletBalance: wallet.balance,
      canisterId: $authState.userCanisterId || '',
      ...formData,
    })
    if (!res) throw 'Something went wrong'
    formLoading = false
    participated = true
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

  if (wallet.error || wallet.loading) {
    formErrors = ['Could not fetch wallet balance. Please refresh the page']
    return
  }

  const email = formData.email.trim()
  if (!email) {
    formErrors.push('Email is required')
  } else if (!validateWithRegex('email', email)) {
    formErrors.push('Email is invalid')
  }

  const url = formData.tweetLink.trim()
  if (!url) {
    formErrors.push('Tweet link is required')
  } else if (!validateWithRegex('url', url)) {
    formErrors.push('Tweet link is invalid')
  }

  if (formData.sns1Token.checked) {
    const principal = formData.sns1Token.principalId.trim()
    if (!principal) {
      formErrors.push('Principal ID for SNS-1 Token is required')
    } else if (!isPrincipal(principal)) {
      formErrors.push('Principal ID for SNS-1 Token is invalid')
    }
  }

  if (formData.chatToken.checked) {
    const principal = formData.chatToken.principalId.trim()
    if (!principal) {
      formErrors.push('Principal ID for Chat Token is required')
    } else if (!isPrincipal(principal)) {
      formErrors.push('Principal ID for Chat Token is invalid')
    }
  }

  if (formData.fundedNft.checked) {
    const principal = formData.fundedNft.principalId.trim()
    if (!principal) {
      formErrors.push('Principal ID for Funded NFT is required')
    } else if (!isPrincipal(principal)) {
      formErrors.push('Principal ID for Funded NFT is invalid')
    }
  }

  if (formData.gobGobNft.checked) {
    const principal = formData.gobGobNft.principalId.trim()
    if (!principal) {
      formErrors.push('Principal ID for Gob Gob NFT is required')
    } else if (!isPrincipal(principal)) {
      formErrors.push('Principal ID for Gob Gob NFT is invalid')
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
          $ 300,000 <sub class="align-super text-white">*</sub>
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
      <div class="flex w-full justify-center pt-8">
        <LoadingIcon class="h-8 w-8 animate-spin-slow" />
      </div>
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
          bind:value={formData.email}
          type="email"
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
          bind:value={formData.tweetLink}
          placeholder="Enter your tweet link"
          class="flex-1 rounded-md border-0 bg-white/10 p-2 text-sm outline-none ring-0 focus:border-0 focus:outline-none focus:ring-0" />
      </div>
      <div class="flex flex-col gap-2">
        <span class="text-sm text-white">
          Do you own any of the following assets? Please select all that apply
          for additional rewards:
        </span>
        <OptionalInput
          bind:checked={formData.sns1Token.checked}
          bind:value={formData.sns1Token.principalId}
          checkboxLabel="SNS-1 Token"
          inputLabel="Please submit your NNS principal ID"
          inputPlaceholder="Enter Principal ID" />
        <OptionalInput
          bind:checked={formData.chatToken.checked}
          bind:value={formData.chatToken.principalId}
          checkboxLabel="Chat Token"
          inputLabel="Please submit your NNS principal ID"
          inputPlaceholder="Enter Principal ID" />
        <OptionalInput
          bind:checked={formData.fundedNft.checked}
          bind:value={formData.fundedNft.principalId}
          checkboxLabel="Hot or Not Funded NFT"
          inputLabel="Please submit your Plug wallet principal ID"
          inputPlaceholder="Enter Principal ID" />
        <OptionalInput
          bind:checked={formData.gobGobNft.checked}
          bind:value={formData.gobGobNft.principalId}
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
      {#if formErrors.length}
        <div class="flex flex-col gap-1">
          <span>Error(s):</span>
          {#each formErrors as err, i (i)}
            <li class="text-xs text-red-600">{err}</li>
          {/each}
        </div>
      {/if}
      <div>
        <Button
          disabled={formLoading}
          on:click={() => validateData()}
          class="w-full">
          {#if formLoading}
            <LoadingIcon class="h-6 w-6 animate-spin-slow" />
          {:else}
            Join waitlist
          {/if}
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
      <div class="flex h-full w-full flex-col items-center overflow-hidden">
        <AirdropCompleted adjustTopMargin />
      </div>
    {/if}
  </div>
</waitlist-form>
