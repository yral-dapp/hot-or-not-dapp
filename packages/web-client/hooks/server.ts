import type { Handle } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'
import Log from '$lib/utils/Log'
import * as Sentry from '@sentry/sveltekit'
import '$lib/services/sentry.init'

const addHeaders: Handle = async ({ event, resolve }) => {
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

const logError = ({ error, event }: any) => {
  Log({ error, event }, 'error')
}

export const handle: Handle = sequence(Sentry.sentryHandle(), addHeaders)
export const handleError = Sentry.handleErrorWithSentry(logError)
