import adapter from '@sveltejs/adapter-node'
import preprocess from 'svelte-preprocess'

const isDev = process.env.NODE_ENV == 'dev'

console.log('Adapter: node', 'build mode; csp enabled', isDev)

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: preprocess({
    postcss: true,
  }),

  kit: {
    serviceWorker: {
      register: false,
    },
    files: {
      assets: 'static',
      hooks: {
        server: './hooks/server.hooks.ts',
      },
    },
    adapter: adapter(),
  },
}

export default config
