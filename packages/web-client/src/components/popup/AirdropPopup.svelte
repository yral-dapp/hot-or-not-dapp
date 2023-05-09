<script lang="ts">
import Button from '$components/button/Button.svelte'
import IconButton from '$components/button/IconButton.svelte'
import AirdropCompleteGraphics from '$components/icons/AirdropCompleteGraphics.svelte'
import AirdropGraphic from '$components/icons/AirdropGraphic.svelte'
import CloseIcon from '$components/icons/CloseIcon.svelte'
import LoadingIcon from '$components/icons/LoadingIcon.svelte'

export let show = false
let loading = true
let completed = true
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
      <AirdropGraphic class="max-w-80 h-max max-h-80 w-max px-10" />
      <div class="flex w-full max-w-md flex-col items-center space-y-4 px-16">
        <div class="text-5xl font-bold uppercase text-transparent">
          <h1 class="smooth">Airdrop</h1>
          <div class="text-white">Airdrop</div>
          <h1 class="smooth">Airdrop</h1>
        </div>
        <div class="py-4 text-xs">
          Lorem ipsum dolor sit amet, consectetur elit. sed do eiusmod Lorem
          ipsum dolor sit amet consectetur elit, sed do eiusmod.
        </div>
        <Button class="w-full">Join airdrop</Button>
        <button class="w-full bg-transparent py-2">Later</button>
      </div>
    {/if}
  </div>
  <div class="absolute right-4 top-4">
    <IconButton disabled={loading} on:click={() => (show = false)}>
      <CloseIcon class="h-8 w-8" />
    </IconButton>
  </div>
</airdrop>
