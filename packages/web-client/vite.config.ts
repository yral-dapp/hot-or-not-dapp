//@ts-ignore
import { sentrySvelteKit } from '@sentry/sveltekit'
import { sveltekit } from '@sveltejs/kit/vite'
import { resolve } from 'path'
import { defineConfig } from 'vite'
const dfxViteConfig = (await import('./vite.config.dfx')).default

const isDev = process.env.NODE_ENV !== 'production'
console.log(`Starting app in ${isDev ? 'dev' : 'prod'} mode`)

console.log({ dfxViteConfig })

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
    fs: {
      allow: ['../'],
    },
    hmr: process.env.CI ? false : undefined,
    proxy: dfxViteConfig.proxy,
  },

  plugins: [
    sentrySvelteKit({
      sourceMapsUploadOptions: {
        uploadSourceMaps: false,
        org: 'gobazzinga',
        project: 'hot-or-not',
        authToken: process.env.SENTRY_AUTH_TOKEN,
      },
      autoInstrument: false,
    }),
    sveltekit(),
    ...dfxViteConfig.plugins,
  ],
  optimizeDeps: {
    esbuildOptions: dfxViteConfig.optimizeDeps.esbuildOptions,
    include: [
      '@dfinity/principal',
      'clsx',
      'svelte-local-storage-store',
      '@dfinity/auth-client',
      '@dfinity/agent',
      '@sentry/sveltekit',
      'throttle-debounce',
      'idb',
    ],
  },
}))
