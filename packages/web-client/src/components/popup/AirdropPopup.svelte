<script lang="ts">
import AirdropCompleted from '$components/airdrop-form/AirdropCompleted.svelte'
import Button from '$components/button/Button.svelte'
import IconButton from '$components/button/IconButton.svelte'
import AirdropEndGraphics from '$components/icons/AirdropEndGraphics.svelte'
import AirdropGraphic from '$components/icons/AirdropGraphic.svelte'
import CloseIcon from '$components/icons/CloseIcon.svelte'
import DiscordIcon from '$components/icons/DiscordIcon.svelte'
import LoadingIcon from '$components/icons/LoadingIcon.svelte'
import TelegramIcon from '$components/icons/TelegramIcon.svelte'
import TwitterIcon from '$components/icons/TwitterIcon.svelte'
import { isFormFilled } from '$lib/helpers/airdrop'
import { authState } from '$stores/auth'
import { loadingAuthStatus } from '$stores/loading'
import { showAirdropPopup } from '$stores/popups'
import AirdropCountdown from './AirdropCountdown.svelte'

let loading = true
let participated = false

$: isLoggedIn = $authState.isLoggedIn

async function checkIfCompleted() {
  if ($authState.idString) {
    participated = await isFormFilled($authState.idString)
    $showAirdropPopup = !participated
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

{#if $showAirdropPopup}
  <airdrop
    class="fade-in absolute z-[100] block h-full w-full bg-black/90 text-white">
    <div
      class="flex h-full w-full flex-col items-center justify-center gap-10 overflow-y-auto py-8">
      {#if participated}
        <div class="flex h-full w-full flex-col items-center">
          <AirdropCompleted on:click={() => ($showAirdropPopup = false)} />
        </div>
      {:else}
        <div class="max-w-80 mt-4 px-16 sm:mt-10 sm:!max-h-80">
          <AirdropEndGraphics class="h-full w-full" />
        </div>
        <div class="flex w-full max-w-md flex-col items-center space-y-4 px-16">
          <div class="text-3xl font-bold uppercase text-transparent text-white">
            the wait is over!!
          </div>
          <div class="text-md text-center">
            Unbox your airdrop now. Just follow the instructions on the link to
            receive your coyns.
          </div>
          <div class="md:y-4 py-2">
            <AirdropCountdown />
          </div>

          <Button
            on:click={() => ($showAirdropPopup = false)}
            disabled={loading}
            href="/airdrop"
            class="w-full">
            {#if loading}
              <LoadingIcon class="h-4 w-4 animate-spin-slow" />
            {:else}
              Claim your airdrop
            {/if}
          </Button>
        </div>
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
      {/if}
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
