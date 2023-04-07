<script lang="ts">
import ProfileIcon from '$components/icons/ProfileIcon.svelte'
import TrophyIcon from '$components/icons/TrophyIcon.svelte'
import c from 'clsx'

export let selectedTab: 'posts' | 'speculations'
</script>

<profile-tabs class="relative flex h-16 w-full shrink-0 justify-between">
  <button
    on:click={() => {
      history.replaceState(null, '', '')
      selectedTab = 'posts'
    }}
    class="flex flex-1 items-center justify-center">
    <ProfileIcon filled={selectedTab === 'posts'} class="h-6 w-6" />
  </button>
  <button
    on:click={() => {
      history.replaceState(null, '', '?tab=speculations')
      selectedTab = 'speculations'
    }}
    class="flex flex-1 items-center justify-center">
    <TrophyIcon filled={selectedTab === 'speculations'} class="h-6 w-6" />
  </button>
  <div
    class={c(
      'absolute inset-x-0 bottom-0 h-1 w-1/2 rounded-full bg-primary duration-200',
      selectedTab === 'posts' ? '' : 'translate-x-full',
    )} />
</profile-tabs>
