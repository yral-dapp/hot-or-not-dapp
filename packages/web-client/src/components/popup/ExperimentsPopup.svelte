<script lang="ts">
import Button from '$components/button/Button.svelte'
import IconButton from '$components/button/IconButton.svelte'
import { fade } from 'svelte/transition'

export let show = false
</script>

{#if show}
  <div
    transition:fade
    class="absolute inset-0 z-[98] flex h-full w-full items-center justify-center bg-black/80">
    <div class="flex max-w-sm flex-col space-y-14">
      <IconButton
        iconName="close"
        iconClass="h-8 w-8 text-white"
        on:click={() => (show = false)}
        class="absolute right-5 top-20 rounded-full bg-black/50 p-2" />
      <div class="flex flex-col items-center">
        <div class="pb-2 text-center text-3xl font-bold text-white">
          Try the Brand New <span class="text-green-500">Up</span>
          -
          <span class="text-red-500">Down</span>
          Game
        </div>
        <div class="pb-2 text-center text-lg text-white">
          Brought to you by Hot or Not
        </div>
      </div>

      <Button href="https://hotornot.lol" target="_blank" type="primary">
        Play Now!
      </Button>
    </div>
  </div>
{/if}
