import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess({
		postcss: true
	}),

	prerender: {
		enabled: false
	},

	kit: {
		prerender: {
			default: true
		},
		adapter: adapter()
	}
};

export default config;
