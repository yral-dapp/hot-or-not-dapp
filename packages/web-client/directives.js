/** @type {import("@sveltejs/kit/types/private").CspDirectives} */
const cspDirectives = {
  'connect-src': [
    'self',
    'https://customer-2p3jflss4r4hmpnz.cloudflarestream.com',
    'https://ic0.app',
    'https://*.ic0.app',
    'https://sentry.io',
    'https://*.sentry.io',
    'https://*.lr-in-prod.com',
    'https://*.google-analytics.com',
    'https://*.gosquared.com',
  ],
  'img-src': [
    'self',
    'https://www.googletagmanager.com',
    'https://hotornot.wtf',
    'https://customer-2p3jflss4r4hmpnz.cloudflarestream.com',
    'https://imagedelivery.net',
    'https://images.unsplash.com',
  ],
  'report-uri': [
    'https://o4504076385124352.ingest.sentry.io/api/4504076386238464/security/?sentry_key=7586a69b01314524b31c8f4f64b41988&sentry_environment=production',
  ],
  'media-src': [
    'self',
    'blob:',
    'data:',
    'https://customer-2p3jflss4r4hmpnz.cloudflarestream.com',
  ],
  'script-src': [
    'self',
    'sha256-/qeDSCLkYHmPQRZSpy6ESTB1rkGghBTDYkeHjWHUwys=',
    'sha256-vbYiNewrabeMlaOVkqLQP7iF+8z5+u9HfIGL2mm0np8=',
    'sha256-NK8YV7rWK86z7bPANGs0hxTjJZ11YaleSgSx58xq+Yg=',
    'sha256-YbseCq5FvHWOJs0CPVvQNUv7ay1kgEqsYiFK0Nj2jtM=',
    'sha256-6DLK+X6XDQTewWRcDgfM+LwJzRdnV8K5zgZAvji3Yt4=',
    'https://www.googletagmanager.com',
    'https://*.cloudfront.net/gosquared.js',
    'https://*.gosquared.com',
  ],
  'worker-src': ['self', 'blob:'],
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
