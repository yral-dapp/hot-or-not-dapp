<script lang="ts">
import { page } from '$app/stores'
import EyeIcon from '$components/icons/EyeIcon.svelte'
import HeartIcon from '$components/icons/HeartIcon.svelte'

export let id: number
export let imageBg: string
export let views: number
export let likes: number

function getShortNumber(number: number) {
  if (number > 1000) {
    return `${Math.round((number / 1000) * 10) / 10}K`
  } else return number
}
</script>

<a
  aria-roledescription="user-post"
  href={`/profile/${$page.params.id}/post/${id}`}
  data-sveltekit-preload-data="tap"
  class="relative aspect-[9/16] w-full cursor-pointer overflow-hidden rounded-md border-[1px] border-white/5 bg-cover bg-center"
  style="background-image: url('{imageBg}')">
  <div
    class="pointer-events-none absolute inset-x-0 bottom-2 flex items-center justify-between space-x-2 px-2">
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
