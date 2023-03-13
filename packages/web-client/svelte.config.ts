import staticAdapter from '@sveltejs/adapter-static'
import cfAdapter from '@sveltejs/adapter-cloudflare'
import preprocess from 'svelte-preprocess'
import directives from './directives.js'
import { type Config } from '@sveltejs/kit'

const isSSR = process.env.BUILD_MODE != 'static'
const isDev = process.env.NODE_ENV == 'dev'

console.log(
  'svelte in',
  isSSR ? 'ssr' : 'static',
  'build mode; csp enabled',
  isDev,
)

const config: Config = {
  preprocess: preprocess({
    postcss: true,
    preserve: ['partytown'],
  }),

  kit: {
    csp: {
      mode: 'hash',
      directives,
    },
    serviceWorker: {
      register: false,
    },
    files: {
      assets: 'static',
      hooks: {
        server: './hooks/server.hooks.ts',
      },
    },
    adapter: isSSR
      ? cfAdapter()
      : staticAdapter({
          fallback: 'index.html',
        }),
  },
}

export default config
