import { writable } from 'svelte/store'

export const auth = writable<{
  camera: boolean
  files: boolean
  audio: boolean
}>
