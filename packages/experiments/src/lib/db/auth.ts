import { BACKEND_HOST } from './index'
import { getHeaders } from './db.utils'
import { get } from 'svelte/store'
import { authState } from '$lib/stores/auth'

export async function registerUser({
  name,
  photoUrl,
  email,
}: {
  name: string
  photoUrl: string
  email: String
}) {
  const refById = get(authState).refById || ''
  await fetch(`${BACKEND_HOST}/register`, {
    method: 'POST',
    headers: getHeaders('POST'),
    body: JSON.stringify({
      name,
      photoUrl,
      email,
      refById,
    }),
  })
}
