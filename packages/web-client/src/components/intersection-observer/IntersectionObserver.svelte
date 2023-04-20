<script lang="ts">
import { createEventDispatcher, onMount } from 'svelte'

export let threshold: number = 0.5
export let intersect: boolean
export let disabled: boolean

const dispatch = createEventDispatcher<{
  intersected: void
}>()

let observer: IntersectionObserver
let intersectionWrapperEl: HTMLElement
let clientHeight: number

function selectListElementAndWatch() {
  try {
    if (intersectionWrapperEl) {
      observer.observe(intersectionWrapperEl)
    }
  } catch (error) {
    console.error(error)
  }
}

function initIntersectionObserver() {
  observer = new IntersectionObserver(
    async (entries) => {
      if (entries[0].isIntersecting) {
        if (!intersect) {
          observer.disconnect()
        } else if (!disabled) {
          dispatch('intersected')
        }
      }
    },
    { threshold },
  )
}

function checkStillVisible() {
  if (!intersectionWrapperEl) return
  const { top } = intersectionWrapperEl.getBoundingClientRect()
  if (top < clientHeight) {
    dispatch('intersected')
  }
}

$: if (!disabled) {
  checkStillVisible()
}

onMount(() => {
  initIntersectionObserver()
  selectListElementAndWatch()
})
</script>

<svelte:window bind:outerHeight={clientHeight} />

<intersection-observer bind:this={intersectionWrapperEl}>
  <slot />
</intersection-observer>
