/* eslint-disable @typescript-eslint/no-unused-vars */
/// <reference types="@sveltejs/kit" />

declare let Hls: typeof import('hls.js').default

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare namespace App {
  // interface Locals {}
  // interface Platform {}
  // interface Session {}
  // interface Stuff {}
}

declare namespace svelteHTML {
  interface SvelteWindowProps {
    'on:beforeinstallprompt'?: (
      event: EventHandler<BeforeInstallPromptEvent, Window> | undefined | null,
    ) => any

    'on:appinstalled'?: (
      event: EventHandler<Event, Window> | undefined | null,
    ) => any
  }

  interface HTMLProps<T> {
    'disableremoteplayback'?: boolean
    'disablepictureinpicture'?: boolean
    'x-webkit-airplay'?: 'deny' | 'allow'
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
