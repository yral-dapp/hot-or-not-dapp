<script lang="ts">
import Ga from '$components/seo/GA.svelte'
import GoSquared from '$components/seo/GoSquared.svelte'
import { partytownSnippet } from '@builder.io/partytown/integration'
import { onMount } from 'svelte'

let scriptEl: any
onMount(() => scriptEl && (scriptEl.textContent = partytownSnippet()))
</script>

<svelte:head>
  <script>
  partytown = {
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
    async
    defer
    src="https://hot-or-not-upload-api-main.go-bazzinga.workers.dev/proxy/ga"></script>
  <script type="text/partytown">
  window.dataLayer = window.dataLayer || []
  function gtag() {
    dataLayer.push(arguments)
  }
  gtag('js', new Date())
  </script>
</svelte:head>

<Ga />

<GoSquared />
