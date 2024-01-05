import Log from '$lib/utils/Log'
import { authState } from '$lib/stores/auth'
import { get } from 'svelte/store'
import { cfWorkerHost } from './stream'

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
    Log('info', 'Generating video upload URL', {
      body,
      from: 'image.generateUrl',
    })
    if (body.success) {
      return body.result as { uploadURL: string; id: string }
    } else {
      return
    }
  } catch (e) {
    Log('error', 'Could not generate video upload URL', {
      error: e,
      from: 'image.generateUrl',
    })
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
    Log('info', 'Uploading profile picture', {
      body,
      from: 'image.uploadProfilePicture',
    })
    if (body.success) {
      return body.result.variants[0] as string
    }
  } catch (e) {
    Log('error', 'Could not upload profile picture', {
      error: e,
      from: 'image.uploadProfilePicture',
    })
    return
  }
}
