import type { Handle, HandleServerError } from '@sveltejs/kit'
import { Toucan } from 'toucan-js'

// If you have custom handlers, make sure to place them after `sentryHandle()` in the `sequence` function.
export const handle: Handle = async ({ event, resolve }) => {
  const response = await resolve(event)
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'no-referrer')
  response.headers.set(
    'Permissions-Policy',
    'autoplay=*, camera=*, microphone=*',
  )
  return response
}

// If you have a custom error handler, pass it to `handleErrorWithSentry`
export const handleError: HandleServerError = ({ error, event }) => {
  const sentry = new Toucan({
    dsn: 'https://7586a69b01314524b31c8f4f64b41988@o4504076385124352.ingest.sentry.io/4504076386238464',
    environment: event.url.host.includes('t:') ? 'localDev' : 'production',
    request: event.request,
    requestDataOptions: {
      allowedCookies: /(.*)/,
      allowedHeaders: /(.*)/,
      allowedSearchParams: /(.*)/,
    },
    ignoreErrors: [
      /Adding invalid event/i, // Replay Error
      /Error in compression worker/i, // Replay Error
      /e.getLastBreadcrumb/i, // Sentry error
      /chrome-extension/i, // Chrome extensions error
      /. is not defined/i, //Unknown error
    ],
  })

  sentry.captureException(error)

  return {
    ...(error as any),
    code: (error as any)?.code ?? 'UNKNOWN',
  }
}
