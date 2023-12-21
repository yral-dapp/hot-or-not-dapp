<script lang="ts">
import { tick } from 'svelte'
import { debounce } from 'throttle-debounce'

export let activeIndex: number
export let index: number
export let keepVideosLoadedCount: number

let show = false

const checkToShow = debounce(200, async (activeIndex: number) => {
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
