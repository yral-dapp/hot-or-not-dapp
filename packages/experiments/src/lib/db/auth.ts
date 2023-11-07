import { BACKEND_HOST } from './index'
import { getHeaders } from './db.utils'

export async function registerUser({
  name,
  photoUrl,
  email,
}: {
  name: string
  photoUrl: string
  email: String
}) {
  await fetch(`${BACKEND_HOST}/register`, {
    method: 'POST',
    headers: getHeaders('POST'),
    body: JSON.stringify({
      name,
      photoUrl,
      email,
    }),
  })
}
