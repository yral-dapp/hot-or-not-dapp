<script lang="ts">
import { tick } from 'svelte'
import { debounce } from 'throttle-debounce'

export let activeIndex: number
export let index: number
export let keepVideosLoadedCount: number
export let browser: boolean

let show = true

const checkToShow = debounce(200, async (activeIndex: number) => {
  if (!browser) return
  await tick()
  requestAnimationFrame(() => {
    show =
      index > activeIndex - keepVideosLoadedCount &&
      index < activeIndex + keepVideosLoadedCount
  })
})

$: checkToShow(activeIndex)
</script>

<slot {show} />
