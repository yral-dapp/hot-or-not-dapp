<script lang="ts">
import Icon from '$components/icon/Icon.svelte'
import { handleParams } from '$lib/utils/params'
import { hideSplashScreen } from '$stores/popups'
import { onMount, tick } from 'svelte'

onMount(async () => {
  handleParams()
  await tick()
  hideSplashScreen(500)
})
</script>

<div class="flex h-full w-full items-center justify-center">
  <div
    class="relative flex h-full w-full flex-col items-center justify-center space-y-8 px-8">
    <Icon name="videos-graphic" class="w-56" />
    <div class="text-center text-lg font-bold">No video found</div>
  </div>
</div>
