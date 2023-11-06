<script lang="ts">
import Icon from '$components/icon/Icon.svelte'
import UpDownVote from '$components/up-down/UpDownVote.svelte'
import { hideSplashScreen } from '$stores/popups'
import { onMount, tick } from 'svelte'

onMount(async () => {
  await tick()
  hideSplashScreen(500)
})
</script>

<div
  class="absolute flex h-full w-full flex-col items-center justify-center space-y-8 bg-black/50 px-8">
  <Icon name="votes-graphics" class="w-56" />
  <div class="text-center text-lg font-bold">
    There are no videos to vote on
  </div>
  <div class="absolute inset-x-0 bottom-20 z-[-1] max-h-48">
    <UpDownVote score={100} />
  </div>
</div>
