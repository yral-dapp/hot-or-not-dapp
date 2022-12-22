import { mergeConfig } from 'vite';
import { defineConfig } from 'vitest/config';
import viteConfig from './vite.config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tsconfigPaths from 'vite-tsconfig-paths';

export default mergeConfig(
	viteConfig,
	defineConfig({
		plugins: [tsconfigPaths(), svelte({ hot: !process.env.VITEST })],
		test: {
			globals: true,
			environment: 'jsdom',
			include: ['**/*.vi.ts'],
			testTimeout: 30_000,
			coverage: {
				all: true,
				include: ['src/components/**'],
				reporter: ['text', 'json', 'html']
			}
		}
	})
);
