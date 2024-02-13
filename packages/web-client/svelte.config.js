import staticAdapter from '@sveltejs/adapter-static'
import preprocess from 'svelte-preprocess'
import nodeAdapter from '@sveltejs/adapter-node'
// import cspDirectives from './directives.js'

const staticMode = process.env.BUILD_MODE == 'static'
const isDev = process.env.NODE_ENV == 'dev'

console.log(
  '\x1b[36m%s\x1b[0m',
  `🅾️ Svelte config: adapter: ${staticMode ? 'static' : 'node'}, CSP: ${isDev}\n`,
)

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: preprocess({
    postcss: true,
  }),

  kit: {
    alias: {
      '$routes/*': './src/routes/*',
    },
    // csp: isDev
    //   ? undefined
    //   : {
    //       mode: 'hash',
    //       directives,
    //     },
    serviceWorker: {
      register: false,
    },
    files: {
      assets: 'static',
      hooks: {
        server: './hooks/server.hooks.ts',
      },
    },
    adapter: staticMode
      ? staticAdapter({
          fallback: 'index.html',
        })
      : nodeAdapter(),
  },
}

export default config
