<script lang="ts">
import SplashScreen from '$components/layout/SplashScreen.svelte'
import { playerState } from '$stores/playerState'
import { onDestroy, onMount } from 'svelte'

function handleVisibilityChange() {
  if (document.visibilityState === 'hidden') {
    $playerState.visible = true
  } else {
    $playerState.visible = false
  }
}

onMount(async () => {
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onDestroy(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>

<SplashScreen />

<slot />
