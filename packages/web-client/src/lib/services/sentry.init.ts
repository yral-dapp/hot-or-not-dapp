import { browser } from '$app/environment'
import * as Sentry from '@sentry/sveltekit'

const production = process.env.NODE_ENV === 'production'

Sentry.init({
  dsn: 'https://2ecb3c2a8aa44ab397c10d5909a76647@o221024.ingest.sentry.io/6729597',
  environment: production ? 'production' : 'local',
  release: process.env.VERSION,
  enabled: production,
  integrations: browser
    ? [
        new Sentry.Replay({
          maskAllText: false,
          blockAllMedia: false,
        }),
      ]
    : [],
  tracesSampleRate: 0.5,
  replaysSessionSampleRate: 0.3,
  replaysOnErrorSampleRate: 1.0,
})
