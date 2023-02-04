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
  <script
    type="text/partytown"
    async
    defer
    src="https://hot-or-not-upload-api-main.go-bazzinga.workers.dev/proxy/gs"></script>
  <script type="text/partytown">
  try {
    _gs = window['_gs'] = window['_gs'] || function () {
      (_gs['script'] = _gs.['script'] || []).push(arguments)
    }

    _gs('GSN-745719-F')
    _gs('set', 'anonymizeIP', true)
    _gs('set', 'chat', { button: false })
  } catch (_) {
    console.warn('[GSErr] init: Error sending data to GS')
  }
  </script>
</svelte:head>

<Ga />

<GoSquared />
