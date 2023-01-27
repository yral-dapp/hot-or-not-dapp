import { mergeConfig } from 'vite'
import { defineConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      include: ['tests/vitest/e2e/**/*.spec.ts'],
      testTimeout: 30_000,
    },
  }),
)
