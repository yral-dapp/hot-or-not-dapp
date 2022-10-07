/** @type {import("@sveltejs/kit/types/private").CspDirectives} */
const cspDirectives = {
	'script-src': [
		'self',
		'report-sample',
		'https://*.lr-in-prod.com',
		'https://*.googletagmanager.com',
		'wasm-eval'
	],
	'worker-src': ['self', 'data:', 'blob:'],
	'connect-src': [
		'self',
		'ws://localhost:*',
		'https://ic0.app',
		'https://*.lr-in-prod.com',
		'https://*.google-analytics.com'
	],
	'img-src': [
		'self',
		'https://customer-2p3jflss4r4hmpnz.cloudflarestream.com',
		'https://imagedelivery.net',
		'https://images.unsplash.com'
	],
	'media-src': ['self', 'data:', 'https://customer-2p3jflss4r4hmpnz.cloudflarestream.com'],
	'font-src': ['self', 'data:', 'https://fonts.gstatic.com'],
	'style-src': ['self', 'unsafe-inline', 'https://fonts.googleapis.com'],
	'default-src': ['self'],
	'base-uri': ['self'],
	'child-src': ['self'],
	'form-action': ['self'],
	'frame-src': ['self'],
	'manifest-src': ['self'],
	'object-src': ['none']
};

export default cspDirectives;
