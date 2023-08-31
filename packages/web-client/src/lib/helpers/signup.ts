import Log from '$lib/utils/Log'
import { configuration } from './backend'

const cfWorkerHost = import.meta.env.VITE_CLOUDFLARE_WORKERS_API_HOST

export async function checkSignupStatusCf(): Promise<boolean> {
  try {
    const res = await fetch(`${cfWorkerHost}/backend/signupStatus`)
    const body = await res.json()
    Log('info', 'Checking signup status on CF', {
      from: 'signup.checkSignupStatusCf',
    })
    if (body.allowed) {
      return true
    } else return false
  } catch (e) {
    Log('error', 'Could not fetch signup status on CF', {
      from: 'signup.checkSignupStatusCf',
      error: e,
    })
    return false
  }
}

export async function checkSignupStatusCanister(): Promise<boolean> {
  try {
    const res = await configuration().are_signups_enabled()
    return res
  } catch (e) {
    Log('error', 'Could not fetch signup status on canister', {
      from: 'signup.checkSignupStatusCanister',
      error: e,
    })
    return false
  }
}
