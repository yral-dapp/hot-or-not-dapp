<script lang="ts">
import HomeLayout from '$lib/components/layout/HomeLayout.svelte'
import BottomNavigation from '$lib/components/navigation/BottomNavigation.svelte'
import Selector from '$lib/components/home/Selector.svelte'
import { page } from '$app/stores'
import { playerState } from '$lib/stores/playerState'
import { onDestroy, onMount } from 'svelte'
import { authState } from '$lib/stores/auth'
import IconButton from '$lib/components/button/IconButton.svelte'
import { browser } from '$app/environment'

function handleVisibilityChange() {
  if (document.visibilityState === 'hidden') {
    $playerState.visible = false
  } else {
    $playerState.visible = true
  }
}

onMount(async () => {
  if (browser) {
    document.addEventListener('visibilitychange', handleVisibilityChange)
  }
})

onDestroy(() => {
  if (browser) {
    document.removeEventListener('visibilitychange', handleVisibilityChange)
  }
})

$: pathname = $page.url.pathname
</script>

<HomeLayout>
  <svelte:fragment slot="top">
    {#if pathname.includes('feed') || pathname.includes('hotornot')}
      <Selector
        selected={pathname.includes('feed') ? 'videos' : 'hot-or-not'} />

      <IconButton
        href="/notifications"
        ariaLabel="Notifications"
        iconName={$authState.isLoggedIn ? 'bell-alert' : 'bell'}
        iconClass="h-6 w-6"
        class="absolute right-6 top-5 flex h-10 w-10 items-center justify-center" />
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
