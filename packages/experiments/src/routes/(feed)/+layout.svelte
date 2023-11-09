<script lang="ts">
import { browser } from '$app/environment'
import { page } from '$app/stores'
import IconButton from '$components/button/IconButton.svelte'
import HomeLayout from '$components/layout/HomeLayout.svelte'
import { playerState } from '$stores/playerState'
import { onDestroy, onMount } from 'svelte'
import { fade } from 'svelte/transition'
import c from 'clsx'

function handleVisibilityChange() {
  if (document.visibilityState === 'hidden') {
    $playerState.visible = false
  } else {
    $playerState.visible = true
  }
}

onMount(async () => {
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onDestroy(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})

$: pathname = browser ? $page.url.pathname : ''
$: resultPage = pathname.includes('result')
$: walletPage = pathname.includes('wallet')
$: votesPage = pathname.includes('votes')
</script>

<HomeLayout>
  <div class="flex items-center justify-center" slot="top">
    <div
      transition:fade
      class="relative flex items-center justify-center space-x-6 rounded-full bg-black/50 py-3 pr-5 text-white">
      <selector
        class={c(
          'absolute inset-x-0 z-[1] h-9 rounded-full bg-primary transition-all duration-200',
          {
            'opacity-0': walletPage || votesPage,
            'w-20 translate-x-[10.25rem]': resultPage,
            'w-40 translate-x-2': !walletPage && !resultPage,
          },
        )} />

      <a
        on:click={() => (resultPage = false)}
        href="/up-down"
        class="z-[2] shrink-0">
        Up & Down Game
      </a>

      <a
        on:click={() => (resultPage = true)}
        href="/up-down/results"
        class="z-[2] flex shrink-0 items-center space-x-2">
        Results
      </a>
    </div>
    <IconButton
      href="/up-down/wallet"
      class="absolute right-4"
      iconName="wallet-fill"
      iconClass="h-6 w-6 {walletPage ? 'text-primary' : 'text-white'}" />
  </div>
  <svelte:fragment slot="content">
    <slot />
  </svelte:fragment>
</HomeLayout>
