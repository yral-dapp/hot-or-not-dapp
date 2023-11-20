<script lang="ts">
import { browser } from '$app/environment'

function removeSplashScreen() {
  const el = document.querySelector('splash-screen')
  el?.remove()
}

$: if (browser) {
  removeSplashScreen()
}
</script>

<slot />
