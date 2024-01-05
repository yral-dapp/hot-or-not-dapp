import { writable } from 'svelte/store'

export const deferredPrompt = writable<BeforeInstallPromptEvent | undefined>(
  undefined,
)
