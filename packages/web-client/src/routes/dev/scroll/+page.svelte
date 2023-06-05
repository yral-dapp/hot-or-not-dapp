<script lang="ts">
import NewPlayerLayout from '$components/layout/NewPlayerLayout.svelte'
const videos = [1, 2, 3, 4, 5]
let index = 0

let topI = 0
let middleI = 1
let bottomI = 2

$: topSlotVideo = videos[topI]
$: middleSlotVideo = videos[middleI]
$: bottomSlotVideo = videos[bottomI]

let preventNext = false

function next() {
  if (index < 2) {
    topI = 0
    middleI = 1
    bottomI = 2
  } else if (topI + 2 == index) {
    topI = bottomI + 1
  } else if (middleI + 2 == index) {
    middleI = topI + 1
  } else if (bottomI + 2 == index) {
    bottomI = middleI + 1
  }
  if (
    bottomI >= videos.length ||
    topI >= videos.length ||
    middleI >= videos.length
  ) {
    preventNext = true
  }
}

function prev() {
  if (index < 2) {
    topI = 0
    middleI = 1
    bottomI = 2
  } else if (topI - 2 == index) {
    topI = middleI - 1
  } else if (middleI - 2 == index) {
    middleI = bottomI - 1
  } else if (bottomI - 2 == index) {
    bottomI = topI - 1
  }
}

$: console.log({ preventNext, topI, middleI, bottomI })
</script>

<NewPlayerLayout {preventNext} on:next={next} on:prev={prev} bind:index>
  <div
    class="flex h-full items-center justify-center text-9xl text-white"
    slot="top">
    {topSlotVideo}
  </div>
  <div
    class="flex h-full items-center justify-center text-9xl text-white"
    slot="middle">
    {middleSlotVideo}
  </div>
  <div
    class="flex h-full items-center justify-center text-9xl text-white"
    slot="bottom">
    {bottomSlotVideo}
  </div>
</NewPlayerLayout>
