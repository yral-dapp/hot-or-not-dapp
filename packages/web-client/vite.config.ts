import { resolve } from 'path'
import { sveltekit } from '@sveltejs/kit/vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { defineConfig } from 'vite'
// import { partytownVite } from '@builder.io/partytown/utils';

const isDev = process.env.NODE_ENV === 'production'

console.log('starting vite in', process.env.NODE_ENV, 'mode')

const DFX_PORT = 4943

let canisterIds = {}

try {
  canisterIds = isDev
    ? await import(
        '../hot-or-not-backend-canister/.dfx/local/canister_ids.json'
      )
    : await import('../hot-or-not-backend-canister/canister_ids.json')
} catch (e) {
  console.error('Error finding canisters info', e)
  throw '⚠ Before starting the dev server you need to run: `dfx deploy`'
}

// Generate canister ids, required by the generated canister code in .dfx/local/canisters/*
// This strange way of JSON.stringifying the value is required by vite
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
    'process.env.DFX_NETWORK': JSON.stringify(isDev ? 'local' : 'ic'),
    'import.meta.env.NODE_ENV': JSON.stringify(
      isDev ? 'development' : 'production',
    ),
    'import.meta.env.ENABLE_SSR': process.env.BUILD_MODE != 'static',
  },
  server: {
    fs: {
      allow: ['../'],
    },
    hmr: process.env.CI
      ? false
      : {
          port: 443,
        },
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
  },
}))
