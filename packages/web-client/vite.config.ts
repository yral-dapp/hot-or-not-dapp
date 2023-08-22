//@ts-ignore
import { sveltekit } from '@sveltejs/kit/vite'
import { resolve } from 'path'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { defineConfig } from 'vite'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import * as dotenv from 'dotenv'

dotenv.config()

const prodCanisterJson = async () =>
  //@ts-ignore
  await import('../hot-or-not-backend-canister/canister_ids.json')
const devCanisterJson = async () => {
  try {
    return await import(
      //@ts-ignore
      '../hot-or-not-backend-canister/.dfx/local/canister_ids.json'
    )
  } catch (e) {
    console.error(
      '⚠️ Error finding dev canister JSON. Did you forget to run `dfx deploy`?',
      e,
    )
    return {}
  }
}

const isDev = process.env.NODE_ENV !== 'production'

console.log('starting app in', isDev ? 'dev' : 'prod', 'mode')

const DFX_PORT = 4943

const canisterIds = isDev ? await devCanisterJson() : await prodCanisterJson()
// Generate canister ids, required by the generated canister code in .dfx/local/canisters/*
// This strange way of JSON.stringify the value is required by vite
const canisterDefinitions = Object.entries(canisterIds).reduce(
  (acc, [key, val]) => ({
    ...acc,
    [`process.env.${key.toUpperCase()}_CANISTER_ID`]: isDev
      ? JSON.stringify((val as any).local)
      : JSON.stringify((val as any).ic),
  }),
  {},
)

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
    // Here we can define global constants
    ...canisterDefinitions,
    'process.env.INTERNET_IDENTITY_CANISTER_ID': JSON.stringify(
      'qhbym-qaaaa-aaaaa-aaafq-cai',
    ),
    'process.env.DFX_NETWORK': JSON.stringify(isDev ? 'local' : 'ic'),
    'import.meta.env.NODE_ENV': JSON.stringify(
      isDev ? 'development' : 'production',
    ),
    'import.meta.env.ENABLE_SSR': process.env.BUILD_MODE !== 'static',
    'import.meta.env.PRODUCTION': process.env.PRODUCTION === 'true',
  },
  server: {
    fs: {
      allow: ['../'],
    },
    hmr: process.env.CI ? false : undefined,
    proxy: {
      // This proxies all http requests made to /api to our running dfx instance
      '/api': {
        target: `http://0.0.0.0:${DFX_PORT}`,
      },
      '/proxytown/gtm': {
        target: 'https://www.googletagmanager.com/gtag/js',
      },
    },
  },
  plugins: [
    sentryVitePlugin({
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: 'gobazzinga',
      project: 'hot-or-not',
    }),
    sveltekit(),
    nodePolyfills({
      // https://github.com/vitejs/vite/discussions/2785#discussioncomment-4738116
      // Whether to polyfill `node:` protocol imports.
      protocolImports: true,
    }),
  ],
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis',
      },
    },
    include: [
      '@dfinity/principal',
      '@sentry/svelte',
      'clsx',
      'svelte-local-storage-store',
      '@dfinity/auth-client',
      '@dfinity/agent',
      'throttle-debounce',
      'idb',
      'hls.js/dist/hls.min.js',
      'swiper/svelte',
    ],
  },
}))
