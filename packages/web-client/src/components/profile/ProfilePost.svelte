<script lang="ts">
import { page } from '$app/stores'
import EyeIcon from '$components/icons/EyeIcon.svelte'
import { getShortNumber } from '$lib/utils/shortNumber'
import HeartIcon from '$components/icons/HeartIcon.svelte'

export let id: number
export let imageBg: string
export let views: number
export let likes: number
</script>

<a
  aria-roledescription="user-post"
  href={`/profile/${$page.params.id}/post/${id}`}
  data-sveltekit-preload-data="tap"
  class="relative aspect-[9/16] w-full cursor-pointer overflow-hidden rounded-md border-[1px] border-white/5">
  <div
    class="absolute inset-0 scale-110 bg-cover bg-center"
    style="background-image: url('{imageBg}')" />
  <div
    class="pointer-events-none absolute inset-x-0 bottom-0 flex h-1/3 items-end justify-between space-x-2 px-2 pb-2"
    style="background: linear-gradient(0deg, rgba(0,0,0,0.5) 0%, transparent 100%);">
    <div class="flex items-center space-x-1">
      <div
        class="flex h-5 w-5 items-center justify-center rounded-full bg-black/50">
        <HeartIcon class="h-3 w-3 text-primary" />
      </div>
      <span class="text-xs">
        {getShortNumber(likes)}
      </span>
    </div>
    <div class="flex items-center space-x-1">
      <div
        class="flex h-5 w-5 items-center justify-center rounded-full bg-black/50">
        <EyeIcon class="h-3 w-3 text-white" />
      </div>
      <span class="text-xs">
        {getShortNumber(views)}
      </span>
    </div>
  </div>
</a>
