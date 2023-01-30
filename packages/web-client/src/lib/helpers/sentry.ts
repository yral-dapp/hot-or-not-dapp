import * as Sentry from '@sentry/browser'

export function setUser(id?: string) {
  Sentry.setUser(id ? { id } : null)
}
