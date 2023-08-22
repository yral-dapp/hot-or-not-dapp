import * as Sentry from '@sentry/svelte'

export function setUser(id?: string) {
  Sentry.setUser(id ? { id } : null)
}
