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

  <!-- prettier-ignore -->
  <script type="text/partytown">
    if("Proxy"in window){var n={get:function(e,r){return new Proxy(function(n){return"flush"===r||"close"===r?Promise.resolve():"function"==typeof n?n(window.Sentry):window.Sentry},n)}};window.Sentry=new Proxy({},n)}
  </script>

  <script
    src="https://browser.sentry-cdn.com/7.36.0/bundle.tracing.replay.min.js"
    integrity="sha384-7tfJTi5j94hjodX3ESndyn59/88CYVw9kwwqXDzVHJH1FOT9KB/FAie508nQlJXJ"
    crossorigin="anonymous"
    type="text/partytown"></script>

  <script type="text/partytown">
  Sentry.init({
    dsn: 'https://7586a69b01314524b31c8f4f64b41988@o4504076385124352.ingest.sentry.io/4504076386238464',
    integrations: [new Sentry.BrowserTracing(), new Sentry.Replay()],
    environment: 'local',
    replaysSessionSampleRate: 0.3,
    replaysOnErrorSampleRate: 1.0,
    ignoreErrors: [
      /(reading 'apply')/i, // Party-town
      /Adding invalid event/i, // Replay Error
      /Error in compression worker/i, // Replay Error
      /e.getLastBreadcrumb/i, // Sentry error
    ],
    beforeSend: (event) => {
      console.log('[SENTRY LOG]', event)
      return event
    },
  })
  </script>
</svelte:head>
