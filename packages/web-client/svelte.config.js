import staticAdapter from '@sveltejs/adapter-static';
import cfAdapter from '@sveltejs/adapter-cloudflare';
import preprocess from 'svelte-preprocess';
import directives from './directives.js';

const isSSR = process.env.BUILD_MODE != 'static';
console.log('svelte in', isSSR ? 'ssr' : 'static', 'build mode');

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess({
		postcss: true
	}),
	kit: {
		csp: {
			mode: 'hash',
			directives
		},
		adapter: isSSR
			? cfAdapter()
			: staticAdapter({
					fallback: '200.html'
			  })
	}
};

export default config;
