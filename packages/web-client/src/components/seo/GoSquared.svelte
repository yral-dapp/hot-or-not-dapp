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
