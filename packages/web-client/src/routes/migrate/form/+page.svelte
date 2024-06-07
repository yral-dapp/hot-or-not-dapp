<script lang="ts">
import { navigateBack } from '$lib/stores/navigation'
import goBack from '$lib/utils/goBack'
import IconButton from '@hnn/components/button/IconButton.svelte'
import Icon from '@hnn/components/icon/Icon.svelte'
import HomeLayout from '@hnn/components/web-client/layout/HomeLayout.svelte'
import bigCoin from './bigcoin.webp'
import coinsBg from '../coins.webp'
import Button from '@hnn/components/button/Button.svelte'
import { authState } from '$lib/stores/auth'
import Input from '@hnn/components/input/Input.svelte'
import { fetchPosts, fetchTokenBalance } from '$lib/helpers/profile'
import { isPrincipal } from '$lib/utils/isPrincipal'
import { individualUser } from '$lib/helpers/backend'
import { Principal } from '@dfinity/principal'
import { registerEvent } from '@hnn/components/analytics/GA.utils'

$: if ($authState.isMigrated) {
  transferred = true
  step = 2
}

let loading = false
let walletBalance = 0
let videosUploadedCount = 0
let step = 1
let transferred = false
let yralId = ''
let canId = ''
let error = ''
let transferring = false

$: loggedIn = $authState.isLoggedIn

async function saveMigrationEntry() {
  await fetch('https://submityralmigration-5nps3y6y6a-uc.a.run.app', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      yralUserId: yralId,
      yralCanisterId: canId,
      honUserId: $authState.idString,
      honCanisterId: $authState.userCanisterId,
      walletBalance,
      videosUploadedCount,
    }),
  })
}

async function checkForm() {
  canId = ''
  if (await isPrincipal(yralId)) {
    const res = await fetchUserCanisterId()
    if (res) {
      canId = res
      step = 2
    }
  } else {
    error = 'Invalid principal Id'
  }
}

async function fetchUserCanisterId() {
  try {
    const res = await fetch(`https://yral-metadata.fly.dev/metadata/${yralId}`)
    const data = await res.json()
    if (!('Ok' in data)) throw 'Error'
    return data.Ok.user_canister_id as string
  } catch (e) {
    error =
      'Could not fetch canister ID. Please double check the Yral Principal ID'
  }
}

async function transfer() {
  transferring = true
  try {
    if (!yralId || !canId) {
      error = 'Please provide the Yral principal ID'
      transferring = false
      step = 1
    }
    const res = await individualUser(
      $authState.userCanisterId,
    ).transfer_tokens_and_posts(Principal.from(yralId), Principal.from(canId))
    if ('Ok' in res) {
      registerEvent('migration', {
        status: 'success',
        userId: $authState.idString,
        user_canister_id: $authState.userCanisterId,
        yralUserId: yralId,
        yralCanisterId: canId,
      })
      saveMigrationEntry()
      transferred = true
      $authState.isMigrated = true
    } else {
      registerEvent('migration', {
        status: 'error',
        userId: $authState.idString,
        user_canister_id: $authState.userCanisterId,
        yralUserId: yralId,
        yralCanisterId: canId,
      })
      error =
        Object.keys(res.Err)?.[0]
          ?.split(/(?=[A-Z])/)
          ?.join(' ') +
        (Object.values(res.Err)?.[0] ? Object.values(res.Err)[0] : '')
      step = 1
    }
  } finally {
    transferring = false
  }
}

async function fetchWalletBalance() {
  const res = await fetchTokenBalance()
  if (res.error) {
    walletBalance = -1
  } else {
    walletBalance = res.balance
  }
}

async function fetchVideosCount() {
  if (!$authState.idString) return
  const res = await fetchPosts($authState.idString, 0, 99)

  if (res.error) {
    videosUploadedCount = -1
  } else {
    videosUploadedCount = res.posts.length
  }
}

async function fetchDetails() {
  loading = true
  try {
    await Promise.all([fetchWalletBalance(), fetchVideosCount()])
  } finally {
    loading = false
  }
}

$: if (loggedIn) {
  fetchDetails()
}
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="true" />
  <link
    href="https://fonts.googleapis.com/css2?family=Gloria+Hallelujah&display=swap"
    rel="stylesheet" />
  <title>Migrate to Yral | Hot or Not</title>
</svelte:head>

<HomeLayout>
  <svelte:fragment slot="top">
    <div
      class="flex w-full items-center justify-center bg-black py-4 shadow-xl shadow-black/50">
      Migrate to YRAL
      <div class="absolute left-4 top-4">
        <IconButton
          iconName="caret-left"
          iconClass="h-7 w-7"
          on:click={() => goBack($navigateBack || '/menu', true)}
          class="shrink-0" />
      </div>
    </div>
  </svelte:fragment>
  <div class="h-full w-full overflow-y-auto" slot="content">
    {#if loading}
      <div class="flex h-full w-full items-center justify-center">
        <Icon name="loading" class="h-8 w-8 animate-spin-slow" />
      </div>
    {:else if !loggedIn}
      <div
        class="flex h-full w-full flex-col items-center justify-center gap-4">
        <div>You need to be logged in</div>
        <Button class="w-64">Login to continue</Button>
      </div>
    {:else if step == 2}
      <div
        class="mx-auto flex h-full w-full max-w-sm flex-col items-center gap-10 overflow-y-auto px-8 py-8 lg:max-w-lg">
        <div
          class="relative z-0 mt-20 flex w-full flex-col items-center gap-2 px-8">
          <img src={bigCoin} alt="yral" />
        </div>
        {#if transferred}
          <div class="text-center">
            Your account has been transferred to yral. Go ahead and explore the
            app <a
              target="_blank"
              class="font-bold text-[#E2017B] underline"
              href="https://yral.com">
              Yral.com
            </a>
          </div>
          <Button class="w-full" href="https://t.me/+c-LTX0Cp-ENmMzI1">
            Support
          </Button>
        {:else}
          <div class="text-center">
            Click confirm to complete the transfer. Once you complete the
            transfer, your Coyns will no longer show in hotornot wallet, and
            will be in Yral account submitted. Make sure you have logged in and
            connected google to the Yral account submitted to not lose your
            tokens.Transfer once done cannot be reversed.
          </div>
          <div class="flex flex-col items-center gap-1">
            <div class="text-sm text-white/80">Transferring to Yral ID:</div>
            <div class="font-mono font-medium">{yralId}</div>
          </div>
          <Button disabled={transferring} on:click={transfer} class="w-full">
            {transferring ? 'Transferring...' : 'Confirm'}
          </Button>
        {/if}
      </div>
    {:else}
      <div
        class="mx-auto flex h-full w-full max-w-sm flex-col items-center gap-10 overflow-y-auto px-8 py-8 lg:max-w-lg">
        <div class="relative mt-28 flex w-full flex-col items-center gap-2">
          <div
            class="absolute inset-0 z-0 -mt-10 flex items-center justify-center">
            <img src={coinsBg} alt="bg" class="max-w-84 w-full" />
          </div>
          <div class="z-[1] text-center text-xl font-bold">
            Transfer your HotorNot Account and Wallet Balance to
          </div>
          <a
            target="_blank"
            class="z-[1] text-3xl font-bold uppercase text-[#E2017B]"
            href="https://yral.com">
            Yral.com
          </a>
        </div>
        <a href="/migrate-faq" class="z-[1] font-bold text-primary underline">
          Learn more about the transfer here
        </a>
        <div class="h-1 w-10 border-t border-dashed border-white"></div>
        <div class="flex flex-col items-start justify-center space-y-4">
          <div class="text-sm font-bold text-primary">
            Your Hot or Not Principal ID:
          </div>
          <div class="text-sm">
            {$authState.idString}
          </div>
          <div class="text-sm font-bold text-primary">
            Your Current Wallet Balance:
          </div>
          <div class="text-sm">
            {walletBalance} Coyns
          </div>
          <div class="text-sm font-bold text-primary">Videos Uploaded:</div>
          <div class="text-sm">
            {videosUploadedCount > 98 ? '99+' : videosUploadedCount}
          </div>
          <div class="text font-medium">
            Please submit your yral.com Principal ID*:
          </div>
          <div class="text-sm text-primary">
            Visit Yral.com → Menu → HotorNot Account Transfer → Login with
            Google → Copy the Yral Principal ID
          </div>
          <Input
            bind:value={yralId}
            class="w-full rounded-md bg-white/10 py-4" />

          <div class="text-xs">
            Note: Both the posts and the wallet balance will be transferred to
            your yral account.
          </div>

          {#if error}
            <div class="text-sm font-medium text-red-500">
              Error: {error}
            </div>
          {/if}

          <Button class="w-full" on:click={checkForm}>Transfer</Button>
        </div>
      </div>
    {/if}
  </div>
</HomeLayout>
