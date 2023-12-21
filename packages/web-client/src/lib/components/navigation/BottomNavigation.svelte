<script lang="ts">
import { preloadData } from '$app/navigation'
import { page } from '$app/stores'
import IconButton from '$lib/components/button/IconButton.svelte'
import Icon from '$lib/components/icon/Icon.svelte'
import { playerState } from '$lib/stores/playerState'
import { onMount } from 'svelte'

$: path = $page.url.pathname
$: showBg = !(path.includes('feed') || path.includes('post'))
$: feedUrl =
  $playerState.currentFeedUrl == 'no-videos' ? '' : $playerState.currentFeedUrl

function preloadLinks() {
  !path.includes('menu') && preloadData('/menu')
  !path.includes('upload') && preloadData('/upload')
}

onMount(() => preloadLinks())

$: homeIconFilled = path.includes('feed')
</script>

<bottom-nav
  class="flex w-full items-center justify-between px-4 {showBg
    ? 'bg-black shadow-up'
    : ''}">
  <IconButton
    iconName={homeIconFilled ? 'home-fill' : 'home'}
    iconClass="h-6 w-6 {homeIconFilled ? 'text-primary' : 'text-white'}"
    preload
    ariaLabel="Navigate to home feed"
    href={`/feed/${feedUrl}`}
    class="relative flex items-center px-2 py-5">
    <div
      class:hidden={!path.includes('feed')}
      class="absolute bottom-0 w-full bg-primary py-1 blur-md" />
  </IconButton>
  <IconButton
    iconName={path.includes('leaderboard') ? 'trophy-fill' : 'trophy'}
    iconClass="h-6 w-6 {path.includes('leaderboard')
      ? 'text-primary'
      : 'text-white'}"
    ariaLabel="Navigate to leaderboards"
    href="/leaderboard"
    class="relative flex items-center px-2 py-5">
    <div
      class:hidden={!path.includes('leaderboard')}
      class="absolute bottom-0 w-full bg-primary py-1 blur-md" />
  </IconButton>
  <IconButton
    iconName="plus"
    iconClass="h-4 w-4 text-white"
    ariaLabel="Navigate to create new post"
    href="/upload"
    class="flex items-center rounded-full bg-primary p-3" />
  <IconButton
    iconName={path.includes('wallet') ? 'wallet-fill' : 'wallet'}
    iconClass="h-6 w-6 {path.includes('wallet')
      ? 'text-primary'
      : 'text-white'}"
    ariaLabel="Navigate to wallet page"
    href="/wallet"
    class="relative flex items-center px-2 py-5">
    <div
      class:hidden={!path.includes('wallet')}
      class="absolute bottom-0 w-full bg-primary py-1 blur-md" />
  </IconButton>
  <IconButton
    iconName="text-align-right"
    iconClass="h-6 w-6 {path.includes('menu') ? 'text-primary' : 'text-white'}"
    preload
    ariaLabel="Navigate to menu for more options"
    href="/menu"
    class="relative flex items-center px-2 py-5">
    <div
      class:hidden={!path.includes('menu')}
      class="absolute bottom-0 w-full bg-primary py-1 blur-md" />
  </IconButton>
</bottom-nav>
