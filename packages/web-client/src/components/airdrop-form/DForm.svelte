<script lang="ts">
import { goto } from '$app/navigation'
import Button from '$components/button/Button.svelte'
import Coin3dIcon from '$components/icons/Coin3dIcon.svelte'
import LoadingIcon from '$components/icons/LoadingIcon.svelte'
import Input from '$components/input/Input.svelte'
import DotSeparator from '$components/layout/DotSeparator.svelte'
import LoginButton from '$components/login/LoginButton.svelte'
import { enrollDscvr, isEnrolledDscvr } from '$lib/helpers/airdrop'
import { isPrincipal } from '$lib/utils/isPrincipal'
import { authState } from '$stores/auth'
import { loadingAuthStatus } from '$stores/loading'

let loading = true
let participated = false

async function checkIfCompleted() {
  if ($authState.idString) {
    participated = await isEnrolledDscvr($authState.idString)
  }
  loading = false
}

$: authorized = $authState.isLoggedIn && !$loadingAuthStatus
$: authorized && checkIfCompleted()

let formErrors: string[] = []
let formLoading = false

let dscvrId: string

async function saveFormData() {
  try {
    formLoading = true
    const res = await enrollDscvr({
      principalId: $authState.idString || '',
      dscvrId,
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

  const id = dscvrId.trim()
  if (!id) {
    formErrors.push('Dscvr Principal ID is required')
  } else if (!isPrincipal(id)) {
    formErrors.push('Dscvr Principal ID is invalid')
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
      <div class="mx-auto text-center text-sm">
        <span>Submit your dscvr.one ID for an extra boost!</span>
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
      <div class="flex flex-col gap-2">
        <span class="text-sm text-white">
          Dscvr.one principal ID
          <sub class="align-super text-primary">*</sub>
        </span>
        <Input
          bind:value={dscvrId}
          type="text"
          placeholder="Enter your Dscvr.one principal ID"
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
    {:else}
      <div class="flex h-full w-full flex-col items-center overflow-hidden">
        <div class="text-3xl font-bold uppercase text-transparent text-white">
          Congratulations
        </div>
        <div class="md:text-md py-4 text-center text-sm">
          You have submitted your Dscvr.one ID
        </div>
      </div>
      <div class="w-full px-4 py-4">
        <Button href="/hotornot" class="w-full px-8" type="primary">
          Play to Earn
        </Button>
      </div>
    {/if}
  </div>
</waitlist-form>
