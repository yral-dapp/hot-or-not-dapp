<script lang="ts">
import IconButton from '../../button/IconButton.svelte'

export let pathName: string
export let feedUrl = ''

$: showBg = !(pathName.includes('feed') || pathName.includes('post'))

$: homeIconFilled = pathName.includes('feed')
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
      class:hidden={!pathName.includes('feed')}
      class="absolute bottom-0 w-full bg-primary py-1 blur-md" />
  </IconButton>
  <IconButton
    iconName={pathName.includes('leaderboard') ? 'trophy-fill' : 'trophy'}
    iconClass="h-6 w-6 {pathName.includes('leaderboard')
      ? 'text-primary'
      : 'text-white'}"
    ariaLabel="Navigate to leaderboards"
    href="/leaderboard"
    class="relative flex items-center px-2 py-5">
    <div
      class:hidden={!pathName.includes('leaderboard')}
      class="absolute bottom-0 w-full bg-primary py-1 blur-md" />
  </IconButton>
  <IconButton
    iconName="plus"
    iconClass="h-4 w-4 text-white"
    ariaLabel="Navigate to create new post"
    href="/upload"
    class="flex items-center rounded-full bg-primary p-3" />
  <IconButton
    iconName={pathName.includes('wallet') ? 'wallet-fill' : 'wallet'}
    iconClass="h-6 w-6 {pathName.includes('wallet')
      ? 'text-primary'
      : 'text-white'}"
    ariaLabel="Navigate to wallet page"
    href="/wallet"
    class="relative flex items-center px-2 py-5">
    <div
      class:hidden={!pathName.includes('wallet')}
      class="absolute bottom-0 w-full bg-primary py-1 blur-md" />
  </IconButton>
  <IconButton
    iconName="text-align-right"
    iconClass="h-6 w-6 {pathName.includes('menu')
      ? 'text-primary'
      : 'text-white'}"
    preload
    ariaLabel="Navigate to menu for more options"
    href="/menu"
    class="relative flex items-center px-2 py-5">
    <div
      class:hidden={!pathName.includes('menu')}
      class="absolute bottom-0 w-full bg-primary py-1 blur-md" />
  </IconButton>
</bottom-nav>
