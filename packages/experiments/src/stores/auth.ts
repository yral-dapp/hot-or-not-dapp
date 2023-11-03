import { persisted } from 'svelte-local-storage-store'
import { writable } from 'svelte/store'

export const authState = persisted<{
  isLoggedIn: boolean
  userId?: string
  showLogin: boolean
}>('auth-state', {
  isLoggedIn: false,
  showLogin: false,
})

export const loading = writable(false)
