import staticAdapter from '@sveltejs/adapter-static';
import nodeAdapter from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';

const isEnvIc = process.env.NODE_ENV === 'ic';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess({
		postcss: true
	}),

	prerender: {
		enabled: false
	},

	kit: {
		adapter: isEnvIc ? staticAdapter() : nodeAdapter()
	}
};

export default config;
