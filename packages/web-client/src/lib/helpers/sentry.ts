export function setUser(id?: string) {
  Sentry.setUser(id ? { id } : null)
}
