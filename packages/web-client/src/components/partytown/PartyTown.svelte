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
    src="https://www.googletagmanager.com/gtag/js"></script>
  <script type="text/partytown">
  window.dataLayer = window.dataLayer || []
  function gtag() {
    dataLayer.push(arguments)
  }
  gtag('js', new Date())
  </script>
  <script type="text/partytown">
  try {
    !(function (g, s, q, r, d) {
      r = g[r] =
        g[r] ||
        function () {
          ;(r.q = r.q || []).push(arguments)
        }
      d = s.createElement(q)
      d.src = '//d1l6p2sc9645hc.cloudfront.net/gosquared.js'
      q = s.getElementsByTagName(q)[0]
      q.parentNode.insertBefore(d, q)
    })(window, document, 'script', '_gs')

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
