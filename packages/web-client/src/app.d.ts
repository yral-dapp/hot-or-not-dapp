/// <reference types="@sveltejs/kit" />

declare let Hls: typeof import('hls.js').default

// Info: https://kit.svelte.dev/docs/types#app
declare namespace App {
  // interface Locals {}
}

declare namespace svelteHTML {
  interface HTMLAttributes {
    'on:beforeinstallprompt'?: (event: BeforeInstallPromptEvent) => any
    'on:appinstalled'?: (event: Event) => any
    'disablePictureInPicture'?: boolean
    'disableRemotePlayback'?: boolean
  }
}

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
}
