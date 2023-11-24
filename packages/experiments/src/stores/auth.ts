import { persisted } from 'svelte-local-storage-store'
import { writable } from 'svelte/store'

export const authState = persisted<{
  isLoggedIn: boolean
  userId?: string
  refById?: string
  accessToken?: string
  showLogin: boolean
}>('auth-state', {
  isLoggedIn: false,
  showLogin: false,
})

export const anonUser = persisted<{ id: string; experimentsBalance: number }>(
  'anon-user',
  {
    id: '',
    experimentsBalance: 1000,
  },
)

export const loading = writable(false)
