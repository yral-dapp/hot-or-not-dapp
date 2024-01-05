<script lang="ts">
import { createEventDispatcher, onDestroy, tick } from 'svelte'

export let index: number
export let single = false
export let browser = false
export let show = false

const dispatch = createEventDispatcher<{
  view: number
}>()

let videoSlideEl: HTMLDivElement
let observer: IntersectionObserver | null = null

async function setupIO() {
  if (single || !browser) return
  await tick()
  if (observer) return
  observer = new IntersectionObserver(
    async (entries) => {
      if (entries[0].isIntersecting) {
        dispatch('view', index)
      }
    },
    { threshold: 0.85 },
  )
  observer.observe(videoSlideEl)
}

function unload() {
  observer?.disconnect()
  observer = null
}

$: if (show) {
  setupIO()
} else {
  unload()
}

onDestroy(unload)
</script>

<video-slide
  bind:this={videoSlideEl}
  data-index={index}
  style="height: 100dvh;"
  class="relative flex w-full shrink-0 snap-center snap-always items-center justify-center transition-all">
  {#if show}
    <slot />
  {/if}
</video-slide>
