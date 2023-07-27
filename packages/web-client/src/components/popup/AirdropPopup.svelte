<script lang="ts">
import AirdropCompleted from '$components/airdrop-form/AirdropCompleted.svelte'
import Button from '$components/button/Button.svelte'
import IconButton from '$components/button/IconButton.svelte'
import AirdropCompleteGraphics from '$components/icons/AirdropCompleteGraphics.svelte'
import AirdropEndGraphics from '$components/icons/AirdropEndGraphics.svelte'
import CloseIcon from '$components/icons/CloseIcon.svelte'
import DiscordIcon from '$components/icons/DiscordIcon.svelte'
import LoadingIcon from '$components/icons/LoadingIcon.svelte'
import TelegramIcon from '$components/icons/TelegramIcon.svelte'
import TwitterIcon from '$components/icons/TwitterIcon.svelte'
import { airdropEntryDetails, isNNSIdRegistered } from '$lib/helpers/airdrop'
import { authState } from '$stores/auth'
import { loadingAuthStatus } from '$stores/loading'
import { showAirdropPopup } from '$stores/popups'

let loading = true
let participatedForNNS = false
let participatedForAirdrop = false

$: isLoggedIn = $authState.isLoggedIn

async function checkIfCompleted() {
  if ($authState.idString) {
    const res = await airdropEntryDetails($authState.idString)
    if (!res) {
      participatedForAirdrop = false
    }
    if (res) {
      participatedForAirdrop = true
      participatedForNNS = await isNNSIdRegistered($authState.idString)
      $showAirdropPopup = !participatedForNNS
    }
  }
  loading = false
}

$: if (!$loadingAuthStatus) {
  if (isLoggedIn) {
    checkIfCompleted()
  } else {
    loading = false
    $showAirdropPopup = true
  }
}
</script>

{#if $showAirdropPopup && !loading}
  <airdrop
    class="fade-in absolute z-[100] block h-full w-full bg-black/90 text-white">
    <div
      class="flex h-full w-full flex-col items-center gap-10 overflow-y-auto py-8">
      {#if participatedForNNS}
        <AirdropCompleted />
      {:else if !participatedForAirdrop}
        <div class="max-w-80 mt-4 px-16 sm:mt-10 sm:!max-h-80">
          <AirdropCompleteGraphics class="h-full w-full" />
        </div>
        <div class="flex w-full max-w-md flex-col items-center space-y-4 px-16">
          <div
            class="text-center text-3xl font-bold uppercase text-transparent text-white">
            Airdrop Registration Has Ended
          </div>
          <div class="text-md text-center">
            Thank you for your interest! We are no longer accepting new
            registrations.
          </div>

          <Button
            on:click={() => ($showAirdropPopup = false)}
            disabled={loading}
            class="w-full">
            Play to Earn
          </Button>
        </div>
      {:else}
        <div class="max-w-80 mt-4 px-16 sm:mt-10 sm:!max-h-80">
          <AirdropEndGraphics class="h-full w-full" />
        </div>
        <div class="flex w-full max-w-md flex-col items-center space-y-4 px-16">
          <div
            class="text-center text-3xl font-bold uppercase text-transparent text-white">
            the wait is over!!
          </div>
          <div class="text-md text-center">
            {#if isLoggedIn}
              Your profile has been successfully registered for the airdrop.
              Please submit your NNS Principal ID to start the claim process.
            {:else}
              The HOT token airdrop claim process has started. If you registered
              for the airdrop before 15th July 2023, please login to see your
              status.
            {/if}
          </div>

          <Button
            on:click={() => ($showAirdropPopup = false)}
            disabled={loading}
            href="/airdrop"
            class="w-full">
            {#if loading}
              <LoadingIcon class="h-4 w-4 animate-spin-slow" />
            {:else if isLoggedIn}
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
            <TelegramIcon class="h-5 w-5 -translate-x-[1px]" />
          </a>
          <a
            href="https://discord.gg/GZ9QemnZuj"
            target="_blank"
            class="flex h-12 w-12 items-center justify-center rounded-full border-[1px] border-primary transition-colors duration-200 active:bg-primary">
            <DiscordIcon class="h-5 w-5" />
          </a>
          <a
            href="https://twitter.com/hotornot_dapp"
            target="_blank"
            class="flex h-12 w-12 items-center justify-center rounded-full border-[1px] border-primary transition-colors duration-200 active:bg-primary">
            <TwitterIcon class="h-4 w-4" />
          </a>
        </div>
        <div class="text-center text-sm text-white/70">
          For more queries, you can get in touch with us on our socials
        </div>
      </div>
    </div>
    <div class="absolute right-4 top-4">
      <IconButton
        ariaLabel="close"
        disabled={loading}
        on:click={() => ($showAirdropPopup = false)}>
        <CloseIcon class="h-8 w-8" />
      </IconButton>
    </div>
  </airdrop>
{/if}
