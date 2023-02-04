<script lang="ts">
import { partytownSnippet } from '@builder.io/partytown/integration'
import { onMount } from 'svelte'

let scriptEl: any
onMount(() => scriptEl && (scriptEl.textContent = partytownSnippet()))
</script>

<svelte:head>
  <script>
  partytown = {
    debug: true,
    forward: [
      '_gs', //gosquared
      'dataLayer.push', //google analytics
      'gtag', //google analytics
    ],
  }
  </script>
  <script bind:this={scriptEl}></script>

  <script
    type="text/partytown"
    src="https://www.googletagmanager.com/gtag/js"></script>

  <script type="text/partytown">
  window.dataLayer = window.dataLayer || []
  function gtag() {
    dataLayer.push(arguments)
  }
  gtag('js', new Date())
  window.gtag = gtag
  </script>
</svelte:head>
