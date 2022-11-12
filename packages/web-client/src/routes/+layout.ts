export const ssr = import.meta.env.ENABLE_SSR;

// Polyfill Buffer for development purpose.
// ⚠️ For production build the polyfill needs to be injected with esbuild (see vite.config.ts) because the page might be loaded before the _layout.js which will contains this polyfill
import { Buffer } from 'buffer';
globalThis.Buffer = Buffer;
