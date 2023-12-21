<script lang="ts">
import Icon from '$lib/components/icon/Icon.svelte'
import c from 'clsx'

export let selectedTab: 'posts' | 'speculations'
</script>

<profile-tabs class="relative flex h-16 w-full shrink-0 justify-between">
  <button
    on:click={() => {
      history.replaceState(history.state, '', '')
      selectedTab = 'posts'
    }}
    class="flex flex-1 items-center justify-center">
    <Icon
      name={selectedTab === 'posts' ? 'grid-fill' : 'grid'}
      class="h-6 w-6 {selectedTab === 'posts'
        ? 'text-primary'
        : 'text-white'}" />
  </button>
  <button
    on:click={() => {
      history.replaceState(history.state, '', '?tab=speculations')
      selectedTab = 'speculations'
    }}
    class="flex flex-1 items-center justify-center">
    <Icon
      name={selectedTab === 'speculations' ? 'trophy-fill' : 'trophy'}
      class="h-6 w-6 {selectedTab === 'speculations'
        ? 'text-primary'
        : 'text-white'}" />
  </button>
  <div
    class={c(
      'absolute inset-x-0 bottom-0 h-1 w-1/2 rounded-full bg-primary duration-200',
      selectedTab === 'posts' ? '' : 'translate-x-full',
    )} />
</profile-tabs>
