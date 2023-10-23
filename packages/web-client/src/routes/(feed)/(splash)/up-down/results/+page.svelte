<script lang="ts">
import Avatar from '$components/avatar/Avatar.svelte'
import Icon from '$components/icon/Icon.svelte'
import getDefaultImageUrl from '$lib/utils/getDefaultImageUrl'
import { pluralize } from '$lib/utils/pluralize'
import { fade } from 'svelte/transition'

let img =
  'https://images.unsplash.com/photo-1586810724476-c294fb7ac01b?auto=format&fit=crop&q=80&w=300&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'

let avatarUrl = getDefaultImageUrl('12')
let username = 'Avid'
</script>

<div transition:fade class="mt-20 h-full w-full bg-black px-4 py-2">
  <div class="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
    <a
      href="#"
      data-sveltekit-preload-code="eager"
      class="relative aspect-[3/5] w-full cursor-pointer overflow-hidden rounded-md bg-cover">
      <div
        class="absolute inset-0 scale-110 bg-cover bg-center"
        style="background-image: url('{img}')" />
      <div
        style="background: linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.6) 100%);"
        class="pointer-events-none absolute inset-0 z-[2] flex flex-col justify-between p-2 md:p-4">
        <div class="flex items-center space-x-2">
          <Avatar class="h-6 w-6" src={avatarUrl} />
          <div class="text-xs font-semibold sm:text-sm">
            {username}
          </div>
        </div>
        <div class="flex flex-col">
          <span class="text-xs font-thin uppercase">Your vote</span>
          <span class="pb-2 text-sm font-bold md:text-lg">
            {pluralize('Token', 100)}
          </span>

          <div
            class="flex w-full items-center justify-center space-x-1 rounded-full bg-orange-500 py-1 text-sm text-white md:py-2">
            <Icon name="stopwatch" class="h-5 w-5" />
            <span>30:00</span>
          </div>
        </div>
      </div>
    </a>
  </div>
</div>
