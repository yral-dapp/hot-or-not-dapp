<script lang="ts">
import Button from '$components/button/Button.svelte'
import IconButton from '$components/button/IconButton.svelte'
import AirdropCompleteGraphics from '$components/icons/AirdropCompleteGraphics.svelte'
import AirdropGraphic from '$components/icons/AirdropGraphic.svelte'
import CloseIcon from '$components/icons/CloseIcon.svelte'
import LoadingIcon from '$components/icons/LoadingIcon.svelte'
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
        class="flex w-full max-w-md flex-col items-center space-y-4 px-16 pt-24">
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
