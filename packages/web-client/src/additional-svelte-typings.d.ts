/* eslint-disable @typescript-eslint/no-unused-vars */

// https://github.com/sveltejs/language-tools/blob/master/docs/preprocessors/typescript.md#im-using-an-attributeevent-on-a-dom-element-and-it-throws-a-type-error
declare namespace svelteHTML {
  // Enhance elements

  // interface IntrinsicElements {
  //   'my-custom-element': {
  //     'someattribute': string
  //     'on:event': (e: CustomEvent<any>) => void
  //   }
  // }

  // Enhance attributes

  interface HTMLAttributes<T> {
    'disableremoteplayback'?: boolean
    'disablepictureinpicture'?: boolean
    'x-webkit-airplay'?: 'deny' | 'allow'
    // If you want to use on:beforeinstallprompt
    'on:beforeinstallprompt'?:
      | EventHandler<BeforeInstallPromptEvent, Window>
      | undefined
      | null
    'on:appinstalled'?: (event: any) => any
    // If you want to use myCustomAttribute={..} (note: all lowercase)
    'mycustomattribute'?: any
    // You can replace any with something more specific if you like
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
