<script lang="ts">
import { createEventDispatcher } from 'svelte'
import { tweened } from 'svelte/motion'
import { debounce } from 'throttle-debounce'

export let showGuides = false
export let index = 0
export let preventNext = false

const dispatch = createEventDispatcher<{
  changeIndex: number
  next: void
  prev: void
}>()

let screenHeight = 0
const duration = 200
let topCuttOff = 0
let bottomCuttOff = 0

let dragging = false
let startingPointY = 0
let diff = tweened(0, { duration: 0 })

let translateY1 = tweened(0)
let translateY2 = tweened(3000)
let translateY3 = tweened(3000)

$: dispatch('changeIndex', index)

$: if (screenHeight) {
  translateY1.set(screenHeight * 0, { duration: 0 })
  translateY2.set(screenHeight * 1, { duration: 0 })
  translateY3.set(screenHeight * 2, { duration: 0 })
  topCuttOff = screenHeight / 5
  bottomCuttOff = topCuttOff * 4
}

async function next(offsetY: number = 0) {
  if (preventNext) return
  index++
  dispatch('next')
  if ($translateY1 === 0) {
    if (offsetY) {
      translateY1.set($translateY1 + offsetY, { duration: 0 })
      translateY2.set($translateY2 + offsetY, { duration: 0 })
    }
    translateY1.set(-screenHeight, {
      duration,
    })
    translateY2.set(0, {
      duration,
    })
    translateY3.set(screenHeight, {
      duration: 0,
    })
  } else if ($translateY1 < 0) {
    if (offsetY) {
      translateY2.set($translateY2 + offsetY, { duration: 0 })
      translateY3.set($translateY3 + offsetY, { duration: 0 })
    }
    translateY1.set(screenHeight, {
      duration: 0,
    })
    translateY2.set(-screenHeight, {
      duration,
    })
    translateY3.set(0, {
      duration,
    })
  } else {
    if (offsetY) {
      translateY1.set($translateY1 + offsetY, { duration: 0 })
      translateY3.set($translateY3 + offsetY, { duration: 0 })
    }
    translateY1.set(0, {
      duration,
    })
    translateY2.set(screenHeight, {
      duration: 0,
    })
    translateY3.set(-screenHeight, {
      duration,
    })
  }
}

async function prev(offsetY: number = 0) {
  if (index == 0) return
  if (index > 0) index--
  dispatch('prev')
  if ($translateY1 === 0) {
    if (offsetY) {
      translateY1.set($translateY1 + offsetY, { duration: 0 })
      translateY3.set($translateY3 + offsetY, { duration: 0 })
    }

    translateY1.set(screenHeight, {
      duration,
    })
    translateY2.set(-screenHeight, {
      duration: 0,
    })
    translateY3.set(0, {
      duration,
    })
  } else if ($translateY1 < 0) {
    if (offsetY) {
      translateY1.set($translateY1 + offsetY, { duration: 0 })
      translateY2.set($translateY2 + offsetY, { duration: 0 })
    }

    translateY1.set(0, {
      duration,
    })
    translateY2.set(screenHeight, {
      duration,
    })
    translateY3.set(index === 0 ? screenHeight * 2 : -screenHeight, {
      duration: 0,
    })
  } else {
    if (offsetY) {
      translateY2.set($translateY2 + offsetY, { duration: 0 })
      translateY3.set($translateY3 + offsetY, { duration: 0 })
    }

    translateY1.set(-screenHeight, {
      duration: 0,
    })
    translateY2.set(0, {
      duration: 0,
    })
    translateY3.set(screenHeight, {
      duration,
    })
  }
}

const handleScroll = debounce(
  75,
  (deltaY: number) => {
    if (deltaY > 0) {
      next()
    } else {
      prev()
    }
  },
  {
    atBegin: true,
  },
)

function handleEnd() {
  dragging = false
  const diffY = $diff
  let animateDiff = false

  if (diffY >= topCuttOff) {
    if (index == 0) animateDiff = true
    prev(diffY)
  } else if (Math.abs(diffY) >= topCuttOff) {
    if (preventNext) animateDiff = true
    next(diffY)
  } else {
    animateDiff = true
  }
  diff.set(0, { duration: animateDiff ? duration : 0 })
  startingPointY = 0
}
</script>

<div
  on:mousewheel={({ deltaY }) => handleScroll(deltaY)}
  on:touchstart={(e) => {
    dragging = true
    // console.log(e.touches[0].clientY)
    startingPointY = e.touches[0].clientY
  }}
  on:touchend={handleEnd}
  on:touchmove={(e) => {
    // console.log(e.touches[0].clientY)
    diff.set(e.touches[0].clientY - startingPointY)
  }}
  bind:clientHeight={screenHeight}
  style="height: calc(100% - 4rem - env(safe-area-inset-bottom,0));"
  class="relative w-full overflow-hidden">
  {#if showGuides}
    <div
      style="top: {topCuttOff}px"
      class="absolute z-10 h-1 w-full bg-white" />
    <div
      style="top: {bottomCuttOff}px"
      class="absolute z-10 h-1 w-full bg-white" />
  {/if}
  <div
    style="transform: translate3d(0,{$translateY1 + $diff}px,0);"
    class="absolute top-0 h-full w-full">
    <slot name="top" />
  </div>

  <div
    style="transform: translate3d(0,{$translateY2 + $diff}px,0);"
    class="absolute top-0 h-full w-full">
    <slot name="middle" />
  </div>

  <div
    style="transform: translate3d(0,{$translateY3 + $diff}px,0);"
    class="absolute top-0 h-full w-full">
    <slot name="bottom" />
  </div>
</div>
<div class="fixed bottom-0 flex h-16 items-center gap-16 text-white">
  <button on:click={() => prev(0)}>prev</button>
  <button on:click={() => next(0)}>next</button>
</div>
