import { persisted } from 'svelte-local-storage-store'

export const showOnboarding = persisted('hot-or-not-ob', true)
