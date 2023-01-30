import { mergeConfig } from 'vite'
import { defineConfig } from 'vitest/config'
import viteConfig from './vite.config'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tsconfigPaths from 'vite-tsconfig-paths'

const excludedComponentDirs = [
  'icons',
  'bet-result',
  'coming-soon',
  'corner-ribbon',
  'intersection-observer',
  'layout',
  'home',
]

export default mergeConfig(
  viteConfig,
  defineConfig({
    plugins: [
      tsconfigPaths({ root: '.' }),
      svelte({ hot: !process.env.VITEST }),
    ],
    test: {
      globals: true,
      environment: 'jsdom',
      include: ['tests/vitest/components/**/*.spec.ts'],
      testTimeout: 30_000,
      coverage: {
        all: true,
        include: [
          'src/components/**/*.svelte',
          // ignore UI components
          `!src/components/{${excludedComponentDirs.join(',')}}/**`,
          // 'src/routes/**/*.svelte'
        ],
        reporter: ['text', 'json', 'html'],
      },
      deps: {
        inline: ['clsx'],
      },
    },
  }),
)
