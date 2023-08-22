import * as Sentry from '@sentry/sveltekit'

export function setUser(id?: string) {
  Sentry.setUser(id ? { id } : null)
}
