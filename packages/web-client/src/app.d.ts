/* eslint-disable @typescript-eslint/no-unused-vars */
/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare namespace App {
  // interface Locals {}
  // interface Platform {}
  // interface Session {}
  // interface Stuff {}
}

namespace svelte.JSX {
  interface SvelteWindowProps {
    onbeforeinstallprompt?:
      | EventHandler<BeforeInstallPromptEvent, Window>
      | undefined
      | null
    onappinstalled?: EventHandler<Event, Window> | undefined | null
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
