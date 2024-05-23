<script lang="ts">
import { navigateBack } from '$lib/stores/navigation'
import goBack from '$lib/utils/goBack'
import IconButton from '@hnn/components/button/IconButton.svelte'
import Icon from '@hnn/components/icon/Icon.svelte'
import HomeLayout from '@hnn/components/web-client/layout/HomeLayout.svelte'
import coinsBg from '../coins.webp'
import bigCoin from './bigCoin.webp'
import Button from '@hnn/components/button/Button.svelte'
import { authState } from '$lib/stores/auth'
import Input from '@hnn/components/input/Input.svelte'
import { fetchPosts, fetchTokenBalance } from '$lib/helpers/profile'

let loading = false
let walletBalance = 0
let videosUploadedCount = 0
let step = 1
let transferred = false

$: loggedIn = $authState.isLoggedIn

async function checkForm() {
  transferred = true
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
  if (!$authState.userCanisterId) return
  const res = await fetchPosts($authState.userCanisterId, 100)
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
        class="flex h-full w-full max-w-sm flex-col items-center gap-10 overflow-y-auto px-8 py-8">
        <div
          class="relative mt-20 flex w-full flex-col items-center gap-2 px-8">
          <img src={bigCoin} alt="yral" />
        </div>
        {#if transferred}
          <div class="text-center">
            Your account has been transferred to yral. Go ahead and explore the
            app <a
              target="_blank"
              class="text-3xl font-bold uppercase text-[#E2017B]"
              href="https://yral.com">
              Yral.com
            </a>
          </div>
          <Button class="w-full" href="/migrate-faq">Support</Button>
        {:else}
          <div class="text-center">
            Click confirm to complete the transfer.Once you complete the
            transfer, your Coyns will no longer show in hotornot wallet, and
            will be in Yral account submitted. Make sure you have logged in and
            connected google to the Yral account submitted to not lose your
            tokens.Transfer once done cannot be reversed.
          </div>
          <Button class="w-full">Confirm</Button>
        {/if}
      </div>
    {:else}
      <div
        class="flex h-full w-full max-w-sm flex-col items-center gap-10 overflow-y-auto px-8 py-8">
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
            class="text-3xl font-bold uppercase text-[#E2017B]"
            href="https://yral.com">
            Yral.com
          </a>
        </div>
        <a href="/migrate" class="font-bold text-primary underline">
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
            {videosUploadedCount > 99 ? '99+' : videosUploadedCount}
          </div>
          <div class="text font-medium">
            Please submit your yral.com Principal ID*:
          </div>
          <div class="text-sm text-primary">
            Visit Yral.com → Menu → HotorNot Account Transfer → Login with
            Google → Copy the Yral Principal ID
          </div>
          <Input class="w-full rounded-md bg-white/10 py-4" />

          <div class="flex gap-2">
            <input
              checked
              type="checkbox"
              class="h-4 w-4 rounded border-2 border-white bg-transparent text-primary focus:ring-0" />

            <div class="text-sm">
              Do you want to transfer your tokens from HON wallet to “xxx” YRAL
              wallet?
            </div>
          </div>

          <Button class="w-full" on:click={checkForm}>Transfer</Button>
        </div>
      </div>
    {/if}
  </div>
</HomeLayout>
