<script lang="ts" context="module">
import { browser } from '$app/environment'

// const debugMode = import.meta.env.NODE_ENV === 'development';
const debugMode = true

export const registerPageView = (
  url: URL | undefined = browser ? new URL(window.location.href) : undefined,
) => {
  if (!browser) return
  if (url?.href) {
    window.gtag?.('event', 'page_view', {
      page_location: url.href,
    })
  }
}

export const updateConfig = (params?: Gtag.CustomParams) => {
  if (!browser) return
  window.gtag?.('config', import.meta.env.VITE_GA_TRACKING_ID, {
    ...params,
    ...(debugMode && { debug_mode: true }),
  })
  return true
}

export const setUserProperties = (params?: Gtag.CustomParams) => {
  if (!browser) return
  window.gtag?.('set', 'user_properties', {
    ...params,
  })
}

export const registerEvent = (
  eventName: Gtag.EventNames | string,
  eventParams?: Gtag.ControlParams | Gtag.EventParams | Gtag.CustomParams,
) => {
  if (!browser) return
  window.gtag?.('event', eventName, {
    ...eventParams,
    ...(debugMode && { debug_mode: true }),
  })
}
</script>

<script lang="ts">
import { page } from '$app/stores'
import { splashScreen } from '$stores/splashScreen'

let configured = false
$: href = $page?.url?.href
$: shown = !$splashScreen?.show

$: if (href || shown) {
  if (!configured) {
    configured = updateConfig() || false
  }
  registerPageView()
}
</script>
