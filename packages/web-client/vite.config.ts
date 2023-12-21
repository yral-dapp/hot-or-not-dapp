//@ts-ignore
import { sveltekit } from '@sveltejs/kit/vite'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import { sentryVitePlugin } from '@sentry/vite-plugin'
const dfxViteConfig = (await import('./vite.config.dfx')).default

const isDev = process.env.NODE_ENV !== 'production'
console.log(`Starting app in ${isDev ? 'dev' : 'prod'} mode`)

export default defineConfig(() => ({
  build: {
    sourcemap: true,
  },
  resolve: {
    alias: {
      $canisters: resolve('./declarations'),
      $components: resolve('./src/components'),
      $routes: resolve('./src/routes'),
      $icons: resolve('./src/icons'),
      $stores: resolve('./src/stores'),
      $assets: resolve('./src/assets'),
    },
  },
  define: {
    ...dfxViteConfig.define,
    'import.meta.env.ENABLE_SSR': process.env.BUILD_MODE !== 'static',
    'import.meta.env.PRODUCTION': process.env.PRODUCTION === 'true',
  },
  server: {
    hmr: process.env.CI ? false : undefined,
    proxy: dfxViteConfig.proxy,
  },

  plugins: [
    sentryVitePlugin({
      disable: true,
      org: 'gobazzinga',
      project: 'hot-or-not',
      authToken: process.env.SENTRY_AUTH_TOKEN,
    }),
    sveltekit(),
    ...dfxViteConfig.plugins,
  ],
  optimizeDeps: {
    esbuildOptions: dfxViteConfig.optimizeDeps.esbuildOptions,
    include: [
      '@dfinity/principal',
      '@sentry/svelte',
      '@sentry/tracing',
      'clsx',
      'svelte-local-storage-store',
      '@dfinity/auth-client',
      '@dfinity/agent',
      '@sentry/browser',
      'throttle-debounce',
      'idb',
      'hls.js/dist/hls.min.js',
    ],
  },
}))
