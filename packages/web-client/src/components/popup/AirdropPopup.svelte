<script lang="ts">
import AirdropCompleted from '$components/airdrop-form/AirdropCompleted.svelte'
import Button from '$components/button/Button.svelte'
import IconButton from '$components/button/IconButton.svelte'
import AirdropCompleteGraphics from '$components/icons/AirdropCompleteGraphics.svelte'
import AirdropGraphic from '$components/icons/AirdropGraphic.svelte'
import CloseIcon from '$components/icons/CloseIcon.svelte'
import DiscordIcon from '$components/icons/DiscordIcon.svelte'
import LoadingIcon from '$components/icons/LoadingIcon.svelte'
import TelegramIcon from '$components/icons/TelegramIcon.svelte'
import TwitterIcon from '$components/icons/TwitterIcon.svelte'
import { showAirdropPopup, splashScreenPopup } from '$stores/popups'
import AirdropCountdown from './AirdropCountdown.svelte'

let loading = false
let completed = false
</script>

{#if $showAirdropPopup && !$splashScreenPopup.show}
  <airdrop
    class="fade-in absolute z-[100] block h-full w-full bg-black/90 text-white">
    <div
      class="flex h-full w-full flex-col items-center justify-center gap-10 overflow-y-auto py-8">
      {#if loading}
        <div class="flex h-full w-full items-center justify-center">
          <LoadingIcon class="h-5 w-5 animate-spin-slow" />
        </div>
      {:else if completed}
        <AirdropCompleted on:click={() => ($showAirdropPopup = false)} />
      {:else}
        <div class="max-w-80 mt-4 px-16 sm:mt-10 sm:!max-h-80">
          <AirdropGraphic class="h-full w-full" />
        </div>
        <div class="flex w-full max-w-md flex-col items-center space-y-4 px-16">
          <div class="text-5xl font-bold uppercase text-transparent text-white">
            Airdrop
          </div>
          <div class="text-md text-center">
            Join the whitelist and receive free HOT tokens
          </div>
          <div class="md:y-4 py-2">
            <AirdropCountdown />
          </div>
          <Button
            on:click={() => ($showAirdropPopup = false)}
            href="/airdrop"
            class="w-full">
            Register
          </Button>
          <a href="/airdrop-guide" class="text-sm">Learn more</a>
        </div>
      {/if}
    </div>
    <div class="absolute right-4 top-4">
      <IconButton
        disabled={loading}
        on:click={() => ($showAirdropPopup = false)}>
        <CloseIcon class="h-8 w-8" />
      </IconButton>
    </div>
  </airdrop>
{/if}
