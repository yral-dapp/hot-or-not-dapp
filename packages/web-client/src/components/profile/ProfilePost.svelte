<script lang="ts">
import { page } from '$app/stores'
import EyeIcon from '$components/icons/EyeIcon.svelte'
import { getShortNumber } from '$lib/utils/shortNumber'
import HeartIcon from '$components/icons/HeartIcon.svelte'
import { onMount } from 'svelte'
import CloudNotAvailableIcon from '$components/icons/CloudNotAvailableIcon.svelte'

export let id: number
export let imageBg: string
export let views: number
export let likes: number

let _img = ''
let notAvailable = false

function loadImg() {
  const image = new Image()
  image.addEventListener('load', () => (_img = imageBg))
  image.addEventListener('error', () => {
    notAvailable = true
  })
  image.src = imageBg
}

onMount(loadImg)
</script>

<a
  aria-roledescription="user-post"
  href={`/profile/${$page.params.id}/post/${id}`}
  data-sveltekit-preload-data="tap"
  class="relative aspect-[9/16] w-full cursor-pointer overflow-hidden rounded-md border-[1px] border-white/20">
  {#if _img}
    <div
      class="absolute inset-0 scale-110 bg-cover bg-center"
      style="background-image: url('{_img}')" />
  {:else if notAvailable}
    <div
      class="gap- absolute inset-0 flex flex-col items-center justify-center">
      <CloudNotAvailableIcon class="h-8 w-8" />
      <span class="text-xs">Not Available</span>
    </div>
  {/if}
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
