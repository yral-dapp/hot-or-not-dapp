import { sveltekit } from '@sveltejs/kit/vite'
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [sveltekit()],
  resolve: {
    alias: {
      $components: resolve('./src/components'),
      $routes: resolve('./src/routes'),
      $icons: resolve('./src/icons'),
      $stores: resolve('./src/stores'),
      $assets: resolve('./src/assets'),
    },
  },
})
