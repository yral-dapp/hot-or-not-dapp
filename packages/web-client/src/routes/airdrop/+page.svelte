<script lang="ts">
import AirdropForm from '$components/airdrop-form/AirdropForm.svelte'
import IconButton from '$components/button/IconButton.svelte'
import HomeLayout from '$components/layout/HomeLayout.svelte'
import goBack from '$lib/utils/goBack'
import { navigateBack } from '$stores/navigation'
import { page } from '$app/stores'
import { authState } from '$stores/auth'
import { loadingAuthStatus } from '$stores/loading'
import { airdropEntryDetails, isNNSIdRegistered } from '$lib/helpers/airdrop'
import Icon from '$components/icon/Icon.svelte'
import AirdropCompleted from '$components/airdrop-form/AirdropCompleted.svelte'
import AirdropCompleteGraphics from '$components/airdrop-form/AirdropCompleteGraphics.svelte'
import Button from '$components/button/Button.svelte'
import AirdropEndGraphics from '$components/airdrop-form/AirdropEndGraphics.svelte'

let loading = true
let participatedForNNS = false
let participatedForAirdrop = false
let submitted = false
let nnsValue = ''
let wallet = {
  coyn: '0',
  hot: 0,
  loading: true,
}

$: edit = !!$page.url.searchParams.has('edit')
$: editAndSubmitted = edit && !submitted

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
      const nns = await isNNSIdRegistered($authState.idString)
      participatedForNNS = !!nns
      if (typeof nns === 'string') {
        nnsValue = nns
      }
    }
  }
  loading = false
}

$: authorized = $authState.isLoggedIn && !$loadingAuthStatus
$: authorized && checkIfCompleted()
</script>

<svelte:head>
  <title>Airdrop | Hot or Not</title>
</svelte:head>

<HomeLayout>
  <svelte:fragment slot="top">
    <div
      class="flex w-full items-center justify-center bg-black py-4 shadow-xl shadow-black/50">
      Airdrop
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
    {:else}
      <div
        class="flex h-full w-full flex-col items-center gap-10 overflow-y-auto py-8">
        {#if participatedForNNS}
          <AirdropCompleted />
        {:else if !participatedForAirdrop && authorized}
          <div class="max-w-80 mt-4 px-16 sm:mt-10 sm:!max-h-80">
            <AirdropCompleteGraphics class="h-full w-full" />
          </div>
          <div
            class="flex w-full max-w-md flex-col items-center space-y-4 px-16">
            <div
              class="text-center text-3xl font-bold uppercase text-transparent text-white">
              Airdrop Registration Has Ended
            </div>
            <div class="text-center text-sm">
              Thank you for your interest! We are no longer accepting new
              registrations.
            </div>

            <Button href="/" disabled={loading} class="w-full">
              Play to Earn
            </Button>
            <div class="text-center text-[0.6rem] opacity-70">
              <span class="font-bold">PID:</span>
              <span>P: {$authState.idString}</span>
              <span class="font-bold">CID:</span>
              <span>{$authState.userCanisterId}</span>
              <span class="font-bold">S:</span>
              <span>
                A:{participatedForAirdrop ? '1' : '0'},N:{participatedForNNS
                  ? '1'
                  : '0'}
              </span>
            </div>
          </div>
        {:else}
          <div class="max-w-80 mt-4 px-16 sm:mt-10 sm:!max-h-80">
            <AirdropEndGraphics class="h-full w-full" />
          </div>
          <div
            class="flex w-full max-w-md flex-col items-center space-y-4 px-16">
            <div
              class="text-center text-3xl font-bold uppercase text-transparent text-white">
              the wait is over!!
            </div>
            <div class="text-md text-center">
              {#if authorized}
                Your profile has been successfully registered for the airdrop.
                Please submit your NNS HOT Address to start the claim process.
              {:else}
                The HOT token airdrop claim process has started. If you
                registered for the airdrop before 15th July 2023, please login
                to see your status.
              {/if}
            </div>

            <Button disabled={loading} href="/airdrop" class="w-full">
              {#if loading}
                <Icon name="loading" class="h-4 w-4 animate-spin-slow" />
              {:else if authorized}
                Claim your airdrop
              {:else}
                Login
              {/if}
            </Button>
          </div>
        {/if}
        <div class="flex flex-col items-center justify-center space-y-4 px-8">
          <div class="flex items-center space-x-4">
            <a
              href="https://t.me/+c-LTX0Cp-ENmMzI1"
              target="_blank"
              class="flex h-12 w-12 items-center justify-center rounded-full border-[1px] border-primary transition-colors duration-200 active:bg-primary">
              <Icon name="telegram-logo" class="h-5 w-5 -translate-x-[1px]" />
            </a>
            <a
              href="https://discord.gg/GZ9QemnZuj"
              target="_blank"
              class="flex h-12 w-12 items-center justify-center rounded-full border-[1px] border-primary transition-colors duration-200 active:bg-primary">
              <Icon name="discord-logo" class="h-5 w-5" />
            </a>
            <a
              href="https://twitter.com/hotornot_dapp"
              target="_blank"
              class="flex h-12 w-12 items-center justify-center rounded-full border-[1px] border-primary transition-colors duration-200 active:bg-primary">
              <Icon name="twitter-logo" class="h-4 w-4" />
            </a>
          </div>
          <div class="text-center text-sm text-white/70">
            For more queries, you can get in touch with us on our socials
          </div>
        </div>
      </div>
    {/if}
  </div>
</HomeLayout>
