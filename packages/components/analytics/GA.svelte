<script lang="ts">
import { registerPageView, updateConfig } from './GA.utils'

export let tagId: string
export let pageUrl: string | undefined = undefined

let configured = false

$: if (pageUrl) {
  if (!configured) {
    configured = updateConfig(tagId) || false
  }
  registerPageView()
}
</script>

<svelte:head>
  <script
    async
    defer
    src="https://www.googletagmanager.com/gtag/js?id={tagId}"></script>
  <script>
  window.dataLayer = window.dataLayer || []
  function gtag() {
    dataLayer.push(arguments)
  }
  gtag('js', new Date())
  </script>
</svelte:head>
