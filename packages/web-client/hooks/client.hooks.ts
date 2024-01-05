import type { RequestEvent } from '@sveltejs/kit'
import * as Sentry from '@sentry/sveltekit'
import Log from '$lib/utils/Log'

const productionHost = 'hotornot.wtf'
const prod = window.location.host === productionHost

Sentry.init({
  dsn: 'https://7586a69b01314524b31c8f4f64b41988@o4504076385124352.ingest.sentry.io/4504076386238464',
  integrations: [new Sentry.Replay()],
  environment: prod ? 'production' : 'local',
  tracesSampleRate: 1,
  replaysSessionSampleRate: 0.3,
  replaysOnErrorSampleRate: 1,
  enabled: prod,
  denyUrls: [
    // Chrome extensions
    /extensions\//i,
    /^chrome:\/\//i,
  ],
})

export const handleError = Sentry.handleErrorWithSentry(
  ({ error, event }: { error: unknown; event: RequestEvent }) => {
    Log('error', 'hook error', { error, event })
    Sentry.captureException(error, { extra: { event } })
  },
)
