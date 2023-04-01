<script lang="ts">
import HotOrNotBet from '$components/hot-or-not/HotOrNotBet.svelte'
import NoBetsIcon from '$components/icons/NoBetsIcon.svelte'
import { hideSplashScreen } from '$stores/splashScreen'
import { onMount, tick } from 'svelte'

onMount(async () => {
  await tick()
  hideSplashScreen(500)
})
</script>

<div
  class="absolute flex h-full w-full flex-col items-center justify-center space-y-8 bg-black/50 px-8">
  <NoBetsIcon class="w-56" />
  <div class="text-center text-lg font-bold">There are no videos to bet on</div>
  <div class="absolute inset-x-0 bottom-20 z-[-1] max-h-48">
    <HotOrNotBet disabled />
  </div>
</div>
