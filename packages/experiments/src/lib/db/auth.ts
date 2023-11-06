import { anonUser, authState } from '$stores/auth'
import { get } from 'svelte/store'
import { BACKEND_HOST } from './index'

export async function registerUser() {
  await fetch(`${BACKEND_HOST}/register`, {
    method: 'POST',
    body: JSON.stringify({
      // details from firebase signup
    }),
  })
}

export async function testAuth() {
  console.log('testAuthCalled')
  const _authState = get(authState)
  const _anonUser = get(anonUser)
  await fetch(`${BACKEND_HOST}/ud/register/test`, {
    headers: {
      anon_id: _anonUser.id || '',
      authorization: _authState.accessToken || '',
    },
  })
}
