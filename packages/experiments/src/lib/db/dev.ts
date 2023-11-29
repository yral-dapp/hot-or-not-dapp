import { BACKEND_HOST } from './index'
import { getHeaders } from './db.utils'
import type { ViewChangeParameters } from './db.types'

export async function isDev() {
  const d = await fetch(`${BACKEND_HOST}/feed/view-change/canChange`, {
    method: 'GET',
    headers: getHeaders('GET'),
  })
  return d.json()
}

export async function createNewConfig(config: ViewChangeParameters) {
  const d = await fetch(`${BACKEND_HOST}/feed/view-change`, {
    method: 'POST',
    headers: getHeaders('POST'),
    body: JSON.stringify({
      ...config,
    }),
  })
  return d.json()
}
