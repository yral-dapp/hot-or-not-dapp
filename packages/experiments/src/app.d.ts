/* eslint-disable @typescript-eslint/no-unused-vars */
/// <reference types="@sveltejs/kit" />

declare let Hls: typeof import('hls.js').default

// Info: https://kit.svelte.dev/docs/types#app
declare namespace App {
  // interface Locals {}
  // interface Platform {}
  // interface Session {}
  // interface Stuff {}
}

declare namespace svelteHTML {
  interface HTMLAttributes<T> {
    'on:beforeinstallprompt'?: (event: BeforeInstallPromptEvent) => any
    'on:appinstalled'?: (event: Event) => any
    'disablePictureInPicture'?: boolean
    'disableRemotePlayback'?: boolean
  }
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}
