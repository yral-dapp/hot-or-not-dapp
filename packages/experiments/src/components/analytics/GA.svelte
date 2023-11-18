<script lang="ts">
import { page } from '$app/stores'
import { splashScreenPopup } from '$stores/popups'
import { registerPageView, updateConfig } from './GA.utils'

let configured = false
$: href = $page?.url?.href
$: shown = !$splashScreenPopup?.show

$: if (href || shown) {
  if (!configured) {
    configured = updateConfig() || false
  }
  registerPageView()
}
</script>

<svelte:head>
  <script async defer src="https://www.googletagmanager.com/gtag/js"></script>
  <script>
  window.dataLayer = window.dataLayer || []
  function gtag() {
    dataLayer.push(arguments)
  }
  gtag('js', new Date())
  </script>
</svelte:head>
