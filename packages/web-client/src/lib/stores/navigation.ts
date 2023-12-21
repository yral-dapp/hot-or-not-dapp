import { persisted } from 'svelte-local-storage-store'
import { writable } from 'svelte/store'

export const navigateBack = persisted<string | null>('go-back', null)
export const navigationHistory = writable<string[]>([])
