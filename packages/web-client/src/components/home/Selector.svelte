<script lang="ts">
import HomeIcon from '$components/icons/HomeIcon.svelte'
import { playerState } from '$stores/playerState'
import c from 'clsx'
export let selected: 'videos' | 'hot-or-not' = 'hot-or-not'
export let showDot: 'videos' | 'hot-or-not' | null = null

$: feedUrl =
  $playerState.currentFeedUrl == 'no-videos' ? '' : $playerState.currentFeedUrl
$: hotOrNotUrl =
  $playerState.currentHotOrNotUrl == 'no-videos'
    ? ''
    : $playerState.currentFeedUrl
</script>

<home-selector class="flex w-full items-center justify-center pt-4">
  <div
    class="relative flex items-center justify-center space-x-6 rounded-full bg-black/50 py-3 pr-5 text-white">
    <selector
      class={c(
        'absolute inset-x-0 z-[1] h-9 rounded-full bg-primary p-4 transition-all duration-200',
        selected === 'hot-or-not'
          ? 'w-[6.5rem]  translate-x-2'
          : 'w-[5.5rem] translate-x-[6.75rem]',
      )} />
    {#if showDot === 'hot-or-not'}
      <selector-dot
        class="absolute right-3 top-2 z-[2] rounded-full border-[1px] border-white/50 bg-red-500 p-[0.20rem]" />
    {:else if showDot === 'videos'}
      <selector-dot
        class="absolute left-12 top-2 z-[2] rounded-full border-[1px] border-white/50 bg-red-500 p-[0.20rem]" />
    {/if}

    <a
      href="/hotornot/{hotOrNotUrl}"
      on:click={() => (selected = 'hot-or-not')}
      class="z-[2]">
      Hot or Not
    </a>
    <a
      href="/feed/{feedUrl}"
      on:click={() => (selected = 'videos')}
      class="z-[2] flex items-center space-x-2">
      <HomeIcon filled class="h-3 w-3 text-white" />
      <span>Home</span>
    </a>
  </div>
</home-selector>
