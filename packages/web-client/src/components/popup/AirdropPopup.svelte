<script lang="ts">
import Button from '$components/button/Button.svelte'
import IconButton from '$components/button/IconButton.svelte'
import AirdropCompleteGraphics from '$components/icons/AirdropCompleteGraphics.svelte'
import AirdropGraphic from '$components/icons/AirdropGraphic.svelte'
import CloseIcon from '$components/icons/CloseIcon.svelte'
import DiscordIcon from '$components/icons/DiscordIcon.svelte'
import LoadingIcon from '$components/icons/LoadingIcon.svelte'
import TelegramIcon from '$components/icons/TelegramIcon.svelte'
import TwitterIcon from '$components/icons/TwitterIcon.svelte'
import AirdropCountdown from './AirdropCountdown.svelte'

export let show = false
let loading = false
let completed = false
</script>

<airdrop
  class="fade-in absolute z-[100] block h-full w-full bg-black/90 text-white">
  <div
    class="flex h-full w-full flex-col items-center gap-10 overflow-y-auto py-8">
    {#if loading}
      <div class="flex h-full w-full items-center justify-center">
        <LoadingIcon class="h-5 w-5 animate-spin-slow" />
      </div>
    {:else if completed}
      <div class="max-w-80 max-w-80 max-h max-h-80 w-max px-10">
        <AirdropCompleteGraphics class="h-full w-full" />
      </div>
      <div
        class="flex w-full max-w-md flex-col items-center space-y-4 px-16 pt-8">
        <div class="text-3xl font-bold uppercase text-transparent text-white">
          Congratulations
        </div>
        <div class="text-md py-4 text-center">
          Your Profile has been registered for the airdrop. You can claim your
          airdrop on 31 May, 2023.
        </div>
        <a
          on:click={() => (show = false)}
          href="/airdrop-guide"
          class="text-center text-sm text-primary underline">
          Learn more about the rewards here
        </a>
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
            href="https://discord.gg/KwxCpeQB"
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
    {:else}
      <div class="max-w-80 max-w-80 max-h mt-10 max-h-80 w-max px-10">
        <AirdropGraphic class="h-full w-full" />
      </div>
      <div class="flex w-full max-w-md flex-col items-center space-y-4 px-16">
        <div class="text-5xl font-bold uppercase text-transparent text-white">
          Airdrop
        </div>
        <div class="text-md py-4 text-center">
          Join the whitelist and receive free HOT tokens
        </div>
        <div class="py-4">
          <AirdropCountdown />
        </div>
        <Button on:click={() => (show = false)} href="/airdrop" class="w-full">
          Register
        </Button>
        <a href="/airdrop-guide" class="text-sm">Learn more</a>
      </div>
    {/if}
  </div>
  <div class="absolute right-4 top-4">
    <IconButton disabled={loading} on:click={() => (show = false)}>
      <CloseIcon class="h-8 w-8" />
    </IconButton>
  </div>
</airdrop>
