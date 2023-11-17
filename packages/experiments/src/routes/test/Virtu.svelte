<script lang="ts">
import { tick } from 'svelte'
import { debounce } from 'throttle-debounce'

export let activeIndex: number
export let index: number

let show = index < 3

const checkToShow = debounce(200, async (activeIndex: number) => {
  await tick()
  setTimeout(() => {
    show = index > activeIndex - 4 && index < activeIndex + 4
  }, 0)
})

$: checkToShow(activeIndex)
$: console.log(index, show)
</script>

<slot {show} />
