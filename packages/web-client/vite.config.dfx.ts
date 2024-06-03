import { nodePolyfills } from 'vite-plugin-node-polyfills'
import prodCanisterIds from '@hnn/declarations/canister_ids.json' assert { type: 'json' }

const DFX_PORT = 4943
const devEnv = process.env.NODE_ENV !== 'production'
const devCanisterJson = await getDevCanisterJson()
const devMode = devEnv && devCanisterJson

const canisterIds = devMode ? devCanisterJson : prodCanisterIds

const canisterDefinitions = Object.entries(canisterIds).reduce(
  (acc, [key, val]) => ({
    ...acc,
    [`process.env.CANISTER_ID_${key.toUpperCase()}`]: devMode
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
    if (devMode) {
      console.log(
        '\x1b[33m%s\x1b[33m',
        '\nWarning: Dev canister_ids.json not found. App will now use production canister_ids.json. Did you forget to run `dfx deploy`?',
      )
    }
    return undefined
  }
}

export default {
  define: {
    ...canisterDefinitions,
    'process.env.INTERNET_IDENTITY_CANISTER_ID': JSON.stringify(
      'qhbym-qaaaa-aaaaa-aaafq-cai',
    ),
    'process.env.DFX_NETWORK': JSON.stringify(devMode ? 'local' : 'ic'),
    'import.meta.env.NODE_ENV': JSON.stringify(devMode ? 'dev' : 'prod'),
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
    }) as any,
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
