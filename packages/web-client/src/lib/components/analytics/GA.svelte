<script lang="ts">
import { page } from '$app/stores'
import { registerPageView, updateConfig } from './GA.utils'

let configured = false
$: href = $page?.url?.href

$: if (href) {
  if (!configured) {
    configured = updateConfig() || false
  }
  registerPageView()
}
</script>

<svelte:head>
  <script
    async
    defer
    src="https://www.googletagmanager.com/gtag/js?id=G-S9P26021F9"></script>
  <script>
  window.dataLayer = window.dataLayer || []
  function gtag() {
    dataLayer.push(arguments)
  }
  gtag('js', new Date())
  </script>
</svelte:head>
