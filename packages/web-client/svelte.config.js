import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess({
		postcss: true
	}),
	kit: {
		prerender: {
			default: false,
			entries: []
		},
		adapter: adapter({
			fallback: '200.html'
		})
	}
};

export default config;
