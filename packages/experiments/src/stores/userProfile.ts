import { writable } from 'svelte/store'

export type UserProfile = {
  id?: string
  experimentsBalance?: number
  email?: string
  name: string
  photoUrl: string
}

export default writable<UserProfile>({
  name: '',
  photoUrl: '',
})
