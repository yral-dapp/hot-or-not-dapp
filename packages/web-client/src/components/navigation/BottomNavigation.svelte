<script lang="ts">
import { preloadData } from '$app/navigation'
import { page } from '$app/stores'
import IconButton from '$components/button/IconButton.svelte'
import HomeIcon from '$components/icons/HomeIcon.svelte'
import MenuIcon from '$components/icons/MenuIcon.svelte'
import PlusIcon from '$components/icons/PlusIcon.svelte'
import TrophyIcon from '$components/icons/TrophyIcon.svelte'
import WalletIcon from '$components/icons/WalletIcon.svelte'
import { playerState } from '$stores/playerState'
import { onMount } from 'svelte'

$: pathname = $page.url.pathname
$: showBg = !(
  pathname.includes('feed') ||
  pathname.includes('hotornot') ||
  pathname.includes('post')
)
$: feedUrl =
  $playerState.currentFeedUrl == 'no-videos' ? '' : $playerState.currentFeedUrl

function preloadLinks() {
  !pathname.includes('menu') && preloadData('/menu')
  !pathname.includes('upload') && preloadData('/upload')
}

onMount(() => preloadLinks())

$: homeIconFilled = pathname.includes('feed')
</script>

<bottom-nav
  class="flex w-full items-center justify-between px-4 {showBg
    ? 'bg-black shadow-up'
    : ''}">
  <IconButton
    preload
    ariaLabel="Navigate to home feed"
    href={`/feed/${feedUrl}`}
    class="relative flex items-center px-2 py-5">
    <HomeIcon
      filled={homeIconFilled}
      class="h-6 w-6 {homeIconFilled ? 'text-primary' : 'text-white'} " />
    <div
      class:hidden={!pathname.includes('feed')}
      class="absolute bottom-0 w-full bg-primary py-1 blur-md" />
  </IconButton>
  <IconButton
    ariaLabel="Navigate to leaderboards"
    href="/leaderboard"
    class="relative flex items-center px-2 py-5">
    <TrophyIcon
      filled={pathname.includes('leaderboard')}
      class="h-6 w-6 text-white" />
    <div
      class:hidden={!pathname.includes('leaderboard')}
      class="absolute bottom-0 w-full bg-primary py-1 blur-md" />
  </IconButton>
  <IconButton
    ariaLabel="Navigate to create new post"
    href="/upload"
    class="flex items-center rounded-full bg-primary p-3">
    <PlusIcon class="h-4 w-4 text-white" />
  </IconButton>
  <IconButton
    ariaLabel="Navigate to wallet page"
    href="/wallet"
    class="relative flex items-center px-2 py-5">
    <WalletIcon
      filled={pathname.includes('wallet')}
      class="h-6 w-6 text-white" />
    <div
      class:hidden={!pathname.includes('wallet')}
      class="absolute bottom-0 w-full bg-primary py-1 blur-md" />
  </IconButton>
  <IconButton
    preload
    ariaLabel="Navigate to menu for more options"
    href="/menu"
    class="relative flex items-center px-2 py-5">
    <MenuIcon
      class="h-6 w-6 {pathname.includes('menu')
        ? 'text-primary'
        : 'text-white'}" />
    <div
      class:hidden={!pathname.includes('menu')}
      class="absolute bottom-0 w-full bg-primary py-1 blur-md" />
  </IconButton>
</bottom-nav>
