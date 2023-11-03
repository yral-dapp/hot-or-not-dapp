import { writable } from 'svelte/store'

export type UserProfile = {
  experiments_balance?: number
  email?: string
}

export default writable<UserProfile>({})
