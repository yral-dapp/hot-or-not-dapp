<script lang="ts">
import ArrowUpIcon from '$components/icons/ArrowUpIcon.svelte'

let profile: any
</script>

<div class="flex h-full w-full flex-col overflow-hidden overflow-y-auto">
  <div class="flex items-center justify-between p-6">
    <div class="flex grow flex-col space-y-1">
      <div class="text-sm">Welcome!</div>
      <div class="text-md font-bold">Bruce Wayne</div>
    </div>
    <img
      class="h-12 w-12 rounded-full"
      alt={profile?.display_name}
      src={profile?.profile_picture_url} />
  </div>
  <div class="flex w-full flex-col items-center justify-center space-y-1 py-4">
    <div class="text-sm uppercase">Your coins balance</div>
    <div class="text-4xl font-bold">11,99,520</div>
    <div class="text-xs text-green-600">+ 5,000 (2%)</div>
  </div>
  <img src="https://i.ibb.co/ZS0cFVt/image.png" class="py-4" alt="graph" />
  <div class="px-6 py-4">
    <div
      class="flex w-full items-center justify-between divide-x-2 divide-white/10 rounded-full bg-white/10 py-4 px-2">
      {#each Array(3) as _}
        <button class="flex grow flex-col items-center space-y-1">
          <div
            class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-transparent">
            <ArrowUpIcon class="h-6 w-6" />
          </div>
          <div class="text-xs">Send</div>
        </button>
      {/each}
    </div>
  </div>
  <div class="flex justify-between px-6 pt-4 pb-1">
    <div class="text-sm">Recent Transactions</div>
    <button class="text-sm opacity-50">See all</button>
  </div>
  <div
    class="flex flex-col space-y-2 divide-y-2 divide-white/10 px-6 pt-4 pb-16">
    {#each Array(5) as _}
      <div class="flex items-center justify-between py-4">
        <div class="flex items-center space-x-4">
          <div
            class="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 p-2">
            <div
              class="flex h-full w-full items-center justify-center rounded-full border-2 border-primary bg-transparent">
              <ArrowUpIcon class="h-6 w-6" />
            </div>
          </div>
          <div class="flex flex-col space-y-1">
            <div>XYZ Challenege</div>
            <div class="text-sm opacity-50">200 Coins</div>
          </div>
        </div>
        <div class="text-sm text-green-600">+ 200</div>
      </div>
    {/each}
  </div>
</div>
