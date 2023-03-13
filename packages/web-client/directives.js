/** @type {import("@sveltejs/kit/types/private").CspDirectives} */
const cspDirectives = {
  'script-src': [
    'self',
    'report-sample',
    'https://*.lr-in-prod.com',
    'https://*.googletagmanager.com',
    'wasm-eval',
    'nonce-rAnd0m',
    'sha256-0FOyb71rYY8ZAx0nglAQIyLNmZs4/uR53cog5RxYrt4=', // SHA of the goSquared script
    'sha256-Ldq+1tIcjwDo/zGvEqC/TUgHL8eBmyd54UR6VYtXxdE=', //SHA Of the Gtag fetch script
    'sha256-G6YM50niUSwqExarkhk2LGwuu8PToJsmOYAqXQJi+cQ=', //SHA Of the Gtag init function
  ],
  'connect-src': [
    'self',
    'ws://localhost:*',
    'https://ic0.app',
    'https://*.ic0.app',
    'https://*.sentry.io',
    'https://*.lr-in-prod.com',
    'https://*.google-analytics.com',
  ],
  'img-src': [
    'self',
    'https://customer-2p3jflss4r4hmpnz.cloudflarestream.com',
    'https://imagedelivery.net',
    'https://images.unsplash.com',
  ],
  'media-src': [
    'self',
    'data:',
    'https://customer-2p3jflss4r4hmpnz.cloudflarestream.com',
  ],
  'font-src': ['self', 'data:', 'https://fonts.gstatic.com'],
  'style-src': ['self', 'unsafe-inline', 'https://fonts.googleapis.com'],
  'default-src': ['self'],
  'base-uri': ['self'],
  'child-src': ['self'],
  'form-action': ['self'],
  'frame-src': ['self'],
  'manifest-src': ['self'],
  'object-src': ['none'],
}

export default cspDirectives
