import type { Handle } from '@sveltejs/kit'

const hlsScriptTag =
  '<script async="false" defer="false" src="https://cdn.jsdelivr.net/npm/hls.js@1.4.12/dist/hls.light.min.js"></script>'

export const handle: Handle = async ({ event, resolve }) => {
  const useHls = false
  const response = await resolve(event, {
    transformPageChunk: ({ html }) =>
      html.replace('%js.deps%', useHls ? hlsScriptTag : ''),
  })
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'no-referrer')
  response.headers.set(
    'Permissions-Policy',
    'autoplay=*, camera=*, microphone=*',
  )

  return response
}
