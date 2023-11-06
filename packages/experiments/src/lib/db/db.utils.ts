import { anonUser, authState } from '$stores/auth'
import { get } from 'svelte/store'

export function getHeaders() {
  const _authState = get(authState)
  const _anonUser = get(anonUser)
  return {
    anon_id: _anonUser.id || '',
    authorization: _authState.accessToken || '',
  }
}
