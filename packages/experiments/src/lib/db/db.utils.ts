import { anonUser, authState } from '$lib/stores/auth'
import { get } from 'svelte/store'

export function getHeaders(type: 'POST' | 'GET') {
  const _authState = get(authState)
  const _anonUser = get(anonUser)
  return {
    anon_id: _anonUser.id || '',
    authorization: _authState.accessToken || '',
    ...(type === 'POST' && {
      'Content-Type': 'application/json',
    }),
  }
}
