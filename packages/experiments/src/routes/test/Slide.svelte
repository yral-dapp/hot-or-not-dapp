<script lang="ts">
import { createEventDispatcher, onDestroy, onMount, tick } from 'svelte'
import Hls from 'hls.js'

export let index: number
export let link: string
export let show: boolean

let slideEl: HTMLElement
let observer: IntersectionObserver | null = null
let videoEl: HTMLVideoElement
let hls: Hls | null = null

const dispatch = createEventDispatcher<{
  view: number
}>()

async function setupIO() {
  await tick()
  if (observer) return
  observer = new IntersectionObserver(
    async (entries) => {
      if (entries[0].isIntersecting) {
        dispatch('view', index)
        if (videoEl.paused) {
          videoEl.currentTime = 0
          videoEl.play()
        }
      } else {
        videoEl.pause()
        videoEl.currentTime = 0
      }
    },
    { threshold: 0.75 },
  )
  observer.observe(slideEl)
}

async function loadVideo() {
  await tick()
  if (hls) return
  hls = new Hls({ maxBufferLength: 5 })
  hls?.loadSource(link)
  hls?.attachMedia(videoEl)
  hls?.on(Hls.Events.ERROR, function (event, data) {
    console.error('Plating video error', event, data)
  })
}

function unload() {
  console.log('unloading', index)
  observer?.disconnect()
  observer = null
  if (hls) {
    hls.destroy()
    hls = null
  }
}

$: if (show) {
  console.log('loading', index)
  setupIO()
  loadVideo()
} else {
  unload()
}

onDestroy(() => {
  observer?.disconnect()
})
</script>

<div
  data-index={index}
  bind:this={slideEl}
  class="relative flex h-screen w-full shrink-0 snap-center snap-always items-center justify-center border">
  {#if show}
    <div class="absolute left-0 top-0 bg-black text-5xl text-white">
      {index}
    </div>
    <video bind:this={videoEl} autoplay muted playsinline loop class="w-full" />
  {/if}
</div>
