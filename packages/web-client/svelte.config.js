import staticAdapter from '@sveltejs/adapter-static';
import cfAdapter from '@sveltejs/adapter-cloudflare';
import preprocess from 'svelte-preprocess';

const isSSR = process.env.BUILD_MODE != 'static';
const isDev = process.env.NODE_ENV == 'dev';
console.log('svelte in', isSSR ? 'ssr' : 'static', 'build mode; csp enabled', isDev);

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess({
		postcss: true,
		preserve: ['partytown']
	}),
	kit: {
		// Todo: add CSP config
		// csp: isDev
		// 	? undefined
		// 	: {
		// 			mode: 'hash',
		// 			directives: { 'script-src': ['self'] }
		// 	  },
		serviceWorker: {
			register: false
		},
		adapter: isSSR
			? cfAdapter()
			: staticAdapter({
					fallback: 'index.html'
			  })
	}
};

export default config;
