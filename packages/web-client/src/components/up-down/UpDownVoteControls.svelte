<script>
import Icon from '$components/icon/Icon.svelte'

let selectedCoins = 50
</script>

<div class="flex flex-col items-center justify-center gap-3 pt-4">
  <div
    class="flex items-center justify-between gap-8 rounded-lg bg-black/30 p-1">
    <button
      on:click={(e) => {
        e.stopImmediatePropagation()
        e.preventDefault()
        selectedCoins = 10
      }}
      class:bg-primary={selectedCoins === 10}
      class="flex items-center gap-1 rounded-lg p-2">
      <Icon name="coin-dollar" class="h-4 w-4" />
      <div class="text-xs">10 COYNs</div>
    </button>
    <button
      on:click={() => (selectedCoins = 50)}
      class:bg-primary={selectedCoins === 50}
      class="flex items-center gap-1 rounded-lg p-2">
      <Icon name="coin-dollar" class="h-4 w-4" />
      <div class="text-xs">50 COYNs</div>
    </button>
    <button
      on:click={() => (selectedCoins = 100)}
      class:bg-primary={selectedCoins === 100}
      class="flex items-center gap-1 rounded-lg p-2">
      <Icon name="coin-dollar" class="h-4 w-4" />
      <div class="text-xs">100 COYNs</div>
    </button>
  </div>
  <div class="flex items-center justify-between gap-4 px-4">
    <div
      class="flex w-24 flex-col items-center justify-center gap-1 rounded-md bg-red-500 py-3">
      <div
        class="flex h-5 w-5 items-center justify-center rounded-full bg-white text-red-500">
        <Icon name="arrow-up" class="h-4 w-4 rotate-180" />
      </div>
      <div class="text-sm">Down</div>
    </div>
    <div class="flex flex-col items-center justify-center">
      <div class="text-5xl">100</div>
      <div class="text-sm">Current scrore</div>
    </div>
    <div
      class="flex w-24 flex-col items-center justify-center gap-1 rounded-md bg-green-500 py-3">
      <div
        class="flex h-5 w-5 items-center justify-center rounded-full bg-white text-green-500">
        <Icon name="arrow-up" class="h-4 w-4" />
      </div>
      <div class="text-sm">Up</div>
    </div>
  </div>
</div>
