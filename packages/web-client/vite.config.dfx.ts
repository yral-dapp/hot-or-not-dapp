import { nodePolyfills } from 'vite-plugin-node-polyfills'
import prodCanisterIds from './canister_ids.json'

const isDev = process.env.NODE_ENV !== 'production'
const DFX_PORT = 4943

const devCanisterJson = await getDevCanisterJson()
const canisterIds = isDev && devCanisterJson ? devCanisterJson : prodCanisterIds

const canisterDefinitions = Object.entries(canisterIds).reduce(
  (acc, [key, val]) => ({
    ...acc,
    [`process.env.${key.toUpperCase()}_CANISTER_ID`]: isDev
      ? JSON.stringify((val as any).local)
      : JSON.stringify((val as any).ic),
  }),
  {},
)

async function getDevCanisterJson(): Promise<object | undefined> {
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
    return undefined
  }
}

export default {
  define: {
    ...canisterDefinitions,
    'process.env.INTERNET_IDENTITY_CANISTER_ID': JSON.stringify(
      'qhbym-qaaaa-aaaaa-aaafq-cai',
    ),
    'process.env.DFX_NETWORK': JSON.stringify(isDev ? 'local' : 'ic'),
    'import.meta.env.NODE_ENV': JSON.stringify(
      isDev ? 'development' : 'production',
    ),
  },
  proxy: {
    // This proxies all http requests made to /api to our running dfx instance
    '/api': {
      target: `http://0.0.0.0:${DFX_PORT}`,
    },
  },
  plugins: [
    nodePolyfills({
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
}
