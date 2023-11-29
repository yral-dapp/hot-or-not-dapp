import { BACKEND_HOST } from './index'
import { getHeaders } from './db.utils'

export async function isDev() {
  const d = await fetch(`${BACKEND_HOST}/feed/view-change/canChange`, {
    method: 'GET',
    headers: getHeaders('GET'),
  })
  return d.json()
}
