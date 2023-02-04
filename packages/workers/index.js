import { Router } from 'itty-router'
import getVideoUploadURL from './video/getVideoUploadURL'
import getImageUploadURL from './image/getImageUploadURL'
import getVideoProcessingStatus from './video/getVideoProcessingStatus'
import enableMp4Download from './video/enableMp4Download'
import signupStatus from './backend/signup'
import gaProxy from './proxy/ga'
import gsProxy from './proxy/gs'

const router = Router()

// eslint-disable-next-line no-undef
const allowedRoutes = CORS_ALLOW_ORIGINS.split(',')

const withCorsHeaders = (request) => {
  // eslint-disable-next-line no-undef
  const origin = request.headers.get('origin')
  if (origin && allowedRoutes.includes(origin)) {
    request.corsHeaders = {
      // eslint-disable-next-line no-undef
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST',
      'Access-Control-Max-Age': '1728000',
      'Access-Control-Allow-Headers': [
        'Origin',
        'X-Requested-With',
        'content-type',
        'Accept',
      ],
    }
  }
}

router.all('*', withCorsHeaders).options('*', (request) => {
  return new Response('', { headers: request.corsHeaders })
})

router.post('/video/getVideoUploadURL', getVideoUploadURL)
router.get(
  '/video/:cloudflareVideoUid/getVideoProcessingStatus',
  getVideoProcessingStatus,
)
router.get('/video/:cloudflareVideoUid/enableMp4Download', enableMp4Download)
router.post('/image/getImageUploadURL', getImageUploadURL)
router.get('/backend/signupStatus', signupStatus)
router.get('/proxy/ga', gaProxy)
router.get('/proxy/gs', gsProxy)

// 404 for everything else
router.all('*', () => new Response('Not Found.', { status: 404 }))

// attach the router "handle" to the event handler
addEventListener('fetch', (event) =>
  event.respondWith(router.handle(event.request)),
)
