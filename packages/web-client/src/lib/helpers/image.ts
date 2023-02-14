import Log from '$lib/utils/Log'
import { authState } from '$stores/auth'
import { get } from 'svelte/store'

const cfWorkerHost = import.meta.env.VITE_CLOUDFLARE_WORKERS_API_HOST

async function generateUrl() {
  try {
    const authStateData = get(authState)
    const res = await fetch(`${cfWorkerHost}/image/getImageUploadURL`, {
      method: 'POST',
      body: JSON.stringify({
        principalId: authStateData.idString || '',
        fileName: Date.now().toString(),
      }),
    })
    const body = await res.json()
    Log({ body, from: '0 generateUrl' }, 'info')
    if (body.success) {
      return body.result as { uploadURL: string; id: string }
    } else {
      return
    }
  } catch (e) {
    Log({ error: e, from: '1 generateUrl' }, 'error')
    return
  }
}

export async function uploadProfilePicture(file: Blob | File) {
  const uploadRes = await generateUrl()
  if (!uploadRes || !uploadRes.uploadURL) {
    return
  }
  const formData = new FormData()
  formData.append('file', file)
  try {
    const res = await fetch(uploadRes.uploadURL, {
      method: 'POST',
      body: formData,
    })
    const body = await res.json()
    Log({ body, from: '0 uploadProfilePicture' }, 'info')
    if (body.success) {
      return body.result.variants[0] as string
    }
  } catch (e) {
    Log({ error: e, from: '1 uploadProfilePicture' }, 'error')
    return
  }
}
