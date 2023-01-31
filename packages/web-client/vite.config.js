const require = createRequire(import.meta.url)

import { resolve } from 'path'
import path from 'node:path'
import { createRequire } from 'module'
import { sveltekit } from '@sveltejs/kit/vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { defineConfig } from 'vite'
import { partytownVite } from '@builder.io/partytown/utils'

const outputFolderPath =
  process.env.npm_lifecycle_event === 'build'
    ? '.svelte-kit/cloudflare'
    : 'static'

/** @type {import('vite').UserConfig} */
export default ({ mode }) => {
  const isDev = mode !== 'production'

  console.log('starting vite in', mode, 'mode')

  const DFX_PORT = 4943

  let canisterIds = {}

  try {
    canisterIds = isDev
      ? require('./../../.dfx/local/canister_ids.json')
      : require('./../../canister_ids.json')
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
        ? JSON.stringify(val.local)
        : JSON.stringify(val.ic),
    }),
    {},
  )

  return defineConfig({
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
      },
    },
    plugins: [
      sveltekit(),
      // https://github.com/vitejs/vite/discussions/2785#discussioncomment-4738116
      nodePolyfills({
        // Whether to polyfill `node:` protocol imports.
        protocolImports: true,
      }),
      partytownVite({
        dest: path.join(__dirname, outputFolderPath, '~partytown'),
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
  })
}
