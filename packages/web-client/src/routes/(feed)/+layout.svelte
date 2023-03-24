<script lang="ts">
import HomeLayout from '$components/layout/HomeLayout.svelte'
import BottomNavigation from '$components/navigation/BottomNavigation.svelte'
import Selector from '$components/home/Selector.svelte'
import { page } from '$app/stores'
import { playerState } from '$stores/playerState'
import { onDestroy, onMount } from 'svelte'

function handleVisibilityChange() {
  if (document.visibilityState === 'hidden') {
    $playerState.visible = true
  } else {
    $playerState.visible = false
  }
}

onMount(async () => {
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onDestroy(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})

$: pathname = $page.url.pathname
</script>

<HomeLayout>
  <svelte:fragment slot="top">
    {#if pathname.includes('feed') || pathname.includes('hotornot')}
      <Selector
        selected={pathname.includes('feed') ? 'videos' : 'hot-or-not'} />
    {:else if pathname.includes('menu')}
      <div
        class="flex w-full items-center justify-center bg-black py-4 shadow-xl shadow-black/50">
        Menu
      </div>
    {/if}
  </svelte:fragment>
  <svelte:fragment slot="content">
    <slot />
  </svelte:fragment>
  <div class="w-full" slot="bottom-navigation">
    {#if !pathname.includes('hotornot')}
      <BottomNavigation />
    {/if}
  </div>
</HomeLayout>
