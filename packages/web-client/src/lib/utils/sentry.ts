import Log from './Log'

export async function init(environment: 'localDev' | 'production') {
  const Sentry = await import('@sentry/svelte')
  const { BrowserTracing } = await import('@sentry/tracing')
  Sentry.init({
    dsn: 'https://7586a69b01314524b31c8f4f64b41988@o4504076385124352.ingest.sentry.io/4504076386238464',
    integrations: [new BrowserTracing(), new Sentry.Replay()],
    environment,
    ignoreErrors: [
      /Adding invalid event/i, // Replay Error
      /Error in compression worker/i, // Replay Error
      /e.getLastBreadcrumb/i, // Sentry error
    ],
    beforeSend:
      environment === 'localDev'
        ? (event) => {
            console.log('[SENTRY LOG]', event)
            return event
          }
        : undefined,
  })
  Sentry.makeMain(Sentry.getCurrentHub())
  Log('Sentry Initialized', 'info')
}
