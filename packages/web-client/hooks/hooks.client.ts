import { page } from '$app/stores'
import { handleErrorWithSentry, Replay } from '@sentry/sveltekit'
import * as Sentry from '@sentry/sveltekit'
import { get } from 'svelte/store'

const pageStore = get(page)

Sentry.init({
  dsn: 'https://7586a69b01314524b31c8f4f64b41988@o4504076385124352.ingest.sentry.io/4504076386238464',
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.3,
  replaysOnErrorSampleRate: 1.0,
  environment: pageStore.url.host.includes('t:') ? 'localDev' : 'production',
  integrations: [new Replay()],
  ignoreErrors: [
    /Adding invalid event/i, // Replay Error
    /Error in compression worker/i, // Replay Error
    /e.getLastBreadcrumb/i, // Sentry error
    /chrome-extension/i, // Chrome extensions error
    /. is not defined/i, //Unknown error
  ],
})

// If you have a custom error handler, pass it to `handleErrorWithSentry`
export const handleError = handleErrorWithSentry()
