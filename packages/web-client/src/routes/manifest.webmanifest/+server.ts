export const prerender = true

const config = {
  backgroundColor: 'black',
  description: '',
  siteShortTitle: '',
  siteTitle: '',
  themeColor: '',
}

export const GET = function get({ setHeaders }) {
  const {
    backgroundColor,
    description,
    siteShortTitle,
    siteTitle,
    themeColor,
  } = config
  const manifest = {
    name: siteTitle,
    short_name: siteShortTitle,
    description,
    start_url: '/',
    background_color: backgroundColor,
    theme_color: themeColor,
    display: 'standalone',
    icons: [
      { src: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { src: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
  }
  setHeaders({
    'content-type': 'application/json',
  })
  return new Response(JSON.stringify(manifest))
}
