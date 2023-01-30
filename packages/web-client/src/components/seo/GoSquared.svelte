<script lang="ts" context="module">
import Log from '$lib/utils/Log'

export const toggleChatWidgetVisibility = (show?: boolean) => {
  try {
    if (show !== undefined) {
      ;(window as any)._gs('set', 'chat', show ? 'show' : 'hide')
    } else {
      const shown = (window as any)?._gs('get', 'chat')?.button
      ;(window as any)._gs('set', 'chat', { button: !shown ? 'show' : 'hide' })
    }
  } catch (_) {
    Log('[GSErr] tCWV: Error sending data to GS', 'warn')
  }
}

export const identifyUserGS = (params: {
  id: string
  name?: string
  username?: string
}) => {
  try {
    ;(window as any)._gs?.('identify', {
      ...params,
    })
  } catch (_) {
    Log('[GSErr] iUGS: Error sending data to GS', 'warn')
  }
}

export const unidentifyUserGS = () => {
  ;(window as any)._gs?.('unidentify')
}
</script>

<svelte:head>
  <script>
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
