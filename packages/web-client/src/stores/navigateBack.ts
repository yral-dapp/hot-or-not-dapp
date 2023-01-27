import { persisted } from 'svelte-local-storage-store'

export default persisted<string | null>('go-back', null)
