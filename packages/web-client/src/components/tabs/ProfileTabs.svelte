<script lang="ts">
import ProfileIcon from '$components/icons/ProfileIcon.svelte'
import TrophyIcon from '$components/icons/TrophyIcon.svelte'
import c from 'clsx'

export let selected: 'posts' | 'trophy'
</script>

<profile-tabs class="relative flex h-16 w-full shrink-0 justify-between">
  <button
    on:click={() => (selected = 'posts')}
    class="flex flex-1 items-center justify-center">
    <ProfileIcon filled={selected === 'posts'} class="h-6 w-6" />
  </button>
  <button
    on:click={() => (selected = 'trophy')}
    class="flex flex-1 items-center justify-center">
    <TrophyIcon filled={selected === 'trophy'} class="h-6 w-6" />
  </button>
  <div
    class={c(
      'absolute inset-x-0 bottom-0 h-1 w-1/2 rounded-full bg-primary duration-200',
      selected === 'posts' ? '' : 'translate-x-full',
    )} />
</profile-tabs>
