<script lang="ts">
import Button from '$components/button/Button.svelte'
import AirdropGraphic from '$components/icons/AirdropGraphic.svelte'
import Popup from './Popup.svelte'

export let show = false
</script>

<airdrop
  class="fade-in absolute z-[100] block h-full w-full bg-black/90 text-white">
  <div
    class="flex h-full w-full flex-col items-center justify-center gap-10 overflow-y-auto py-8">
    <AirdropGraphic class="max-w-80 h-max max-h-80 w-max px-10" />
    <div class="flex w-full max-w-md flex-col items-center space-y-4 px-16">
      <div class="text-5xl font-bold uppercase text-transparent">
        <h1 class="smooth">Airdrop</h1>
        <div class="text-white">Airdrop</div>
        <h1 class="smooth">Airdrop</h1>
      </div>
      <div class="py-4 text-xs">
        Lorem ipsum dolor sit amet, consectetur elit. sed do eiusmod Lorem ipsum
        dolor sit amet consectetur elit, sed do eiusmod.
      </div>
      <Button class="w-full">Join airdrop</Button>
      <button class="w-full bg-transparent py-2">Later</button>
    </div>
  </div>
</airdrop>

<style>
.smooth {
  -webkit-text-stroke: 1px #e96b25;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}
</style>
