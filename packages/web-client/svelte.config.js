import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess({
		postcss: true
	}),
	kit: {
		prerender: {
			enabled: false,
			default: true,
			entries: []
		},
		adapter: adapter()
	}
};

export default config;
