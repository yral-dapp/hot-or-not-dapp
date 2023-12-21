<script lang="ts">
import IconButton from '$lib/components/button/IconButton.svelte'
import HomeLayout from '$lib/components/layout/HomeLayout.svelte'
import goBack from '$lib/utils/goBack'
import { navigateBack } from '$lib/stores/navigation'
import { authState } from '$lib/stores/auth'
import { loadingAuthStatus } from '$lib/stores/loading'
import { airdropEntryDetails, isNNSIdRegistered } from '$lib/helpers/airdrop'
import Icon from '$lib/components/icon/Icon.svelte'
import AirdropCompleteGraphics from '$lib/components/airdrop-form/AirdropCompleteGraphics.svelte'
import Button from '$lib/components/button/Button.svelte'
import AirdropEndGraphics from '$lib/components/airdrop-form/AirdropEndGraphics.svelte'

let loading = true
let participatedForNNS = false
let participatedForAirdrop = false
let nnsValue = ''
let wallet = {
  coyn: '0',
  hot: 0,
  loading: true,
}
let transferDetails = {
  nnsId: '',
  neuronId: '',
}

async function checkIfCompleted() {
  if ($authState.idString) {
    const res = await airdropEntryDetails($authState.idString)
    if (!res) {
      participatedForAirdrop = false
    } else {
      wallet.coyn = res?.FinalCOYNWalletBalance
      wallet.hot = res?.FinalHotTokens
      res.splitNeuronId && (transferDetails.neuronId = res.splitNeuronId)
      res.nnsId && (transferDetails.nnsId = res.nnsId)
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
$: !authorized && (loading = false)
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
          <div class="max-w-80 mt-4 px-16 sm:mt-10 sm:!max-h-80">
            <AirdropEndGraphics class="h-full w-full" />
          </div>
          <div
            class="flex w-full max-w-md flex-col items-center space-y-4 px-16">
            <div
              class="text-3xl font-bold uppercase text-transparent text-white">
              Well done!
            </div>
            <div class="text-md text-center">
              You have successfully submitted your NNS Principal ID to claim
              your airdrop.
            </div>
            {#if !wallet.loading}
              <div>
                <div class="text-md text-center">Your Hot token allocation</div>
                <div class="text-md text-center text-3xl font-bold">
                  {wallet.hot}
                </div>
              </div>
            {/if}
            {#if transferDetails.nnsId && transferDetails.neuronId}
              <div class="py-4 text-center text-sm">
                Your reward has been transferred to your NNS dapp account with
                ID {transferDetails.nnsId}. The neuron ID is
                <span class="underline">
                  {transferDetails.neuronId}
                </span>
                .
              </div>
            {:else}
              <div class="py-4 text-center text-sm">
                The HOT tokens will be transferred to your NNS wallet by our
                team over the course of a few months as we go through the
                process manually with over 16,000 winners. Please be patient and
                check our socials for updates.
              </div>
            {/if}

            <Button href="/hotornot" class="w-full">Play to earn</Button>

            <a
              href="/airdrop-guide"
              on:click|stopPropagation
              class="text-sm underline opacity-75">
              Learn more about the rewards here
            </a>
          </div>
        {:else}
          <div class="max-w-80 mt-4 px-16 sm:mt-10 sm:!max-h-80">
            <AirdropCompleteGraphics class="h-full w-full" />
          </div>
          <div
            class="flex w-full max-w-md flex-col items-center space-y-4 px-16">
            <div
              class="text-center text-2xl font-bold uppercase text-transparent text-white">
              {#if participatedForAirdrop}
                Airdrop Claim Form is Closed
              {:else}
                Airdrop Registration Has Ended
              {/if}
            </div>
            <div class="text-md text-center">
              {#if authorized && participatedForAirdrop}
                Thank you for your interest! We are no longer accepting NNS IDs
                of Airdrop participants.
              {:else if authorized}
                Thank you for your interest! We are no longer accepting new
                registrations. Follow our socials for more information
              {:else}
                Thank you for your interest! We are no longer accepting new
                registrations. If you have already claimed the airdrop, please
                login to see your status.
              {/if}
            </div>
            {#if authorized}
              <Button href="/" class="w-full">Play to Earn</Button>
            {:else}
              <Button
                on:click={() => ($authState.showLogin = true)}
                class="w-full">
                Login
              </Button>
            {/if}
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
