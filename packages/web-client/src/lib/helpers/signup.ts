import Log from '$lib/utils/Log'
import { configuration } from './backend'

const cfWorkerHost = import.meta.env.VITE_CLOUDFLARE_WORKERS_API_HOST

export async function checkSignupStatusCf(): Promise<boolean> {
  try {
    const res = await fetch(`${cfWorkerHost}/backend/signupStatus`)
    const body = await res.json()
    Log({ body, from: '0 checkSignupStatusCf' }, 'info')
    if (body.allowed) {
      return true
    } else return false
  } catch (e) {
    Log({ error: e, from: '1 checkSignupStatusCf' }, 'error')
    return false
  }
}

export async function checkSignupStatusCanister(): Promise<boolean> {
  try {
    const res = await configuration().are_signups_enabled()
    return res
  } catch (e) {
    Log({ error: e, from: '1 checkSignupStatusCanister' }, 'error')
    return false
  }
}
