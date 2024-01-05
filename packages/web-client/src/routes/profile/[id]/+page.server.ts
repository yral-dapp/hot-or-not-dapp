export const ssr = true
export const prerender = false

import { individualUser } from '$lib/helpers/backend'
import { getCanisterId } from '$lib/helpers/canisterId'
import {
  fetchPosts,
  sanitizeProfile,
  serializeProfilePostsResponse,
  updateProfile,
} from '$lib/helpers/profile'
import Log from '$lib/utils/Log'
import { authState } from '$lib/stores/auth'
import { userProfile } from '$lib/stores/app'
import { Principal } from '@dfinity/principal'
import { error, redirect } from '@sveltejs/kit'
import { get } from 'svelte/store'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params, fetch }) => {
  const id = params.id

  if (!id) {
    Log('warn', 'No profile ID', { from: 'loadProfile', id: params.id })
    redirect(307, '/menu')
  }

  const userProfileData = get(userProfile)
  const authStateData = get(authState)

  const isUserAnon = id === '2vxsx-fae' || id === 'rajeshmoundekar'

  const isLoggedInAsAnon =
    authStateData.userCanisterId === 'qcdty-nyaaa-aaaao-aaloq-cai'

  if (
    authStateData.isLoggedIn &&
    (id === userProfileData.unique_user_name ||
      id === userProfileData.principal_id)
  ) {
    if (isUserAnon && isLoggedInAsAnon) {
      // Logged in as an anon user
      redirect(307, '/menu?logout=true')
    }
    await updateProfile()
    const updatedProfile = get(userProfile)
    return { me: true, profile: updatedProfile }
  } else {
    if (isUserAnon) {
      // Logged in as an anon user
      redirect(307, '/menu')
    }
    const canId = await getCanisterId(id)
    if (!canId) {
      Log('warn', 'No canister ID', { from: 'loadProfile', id: params.id })
      error(404, "Couldn't find canister Id")
    }
    Log('info', 'Found canister ID', { from: 'loadProfile', canId })
    const fetchedProfile = await individualUser(
      Principal.from(canId),
      fetch,
    ).get_profile_details()
    const profile = sanitizeProfile(fetchedProfile, id)
    let posts: any[] = []
    try {
      const res = await fetchPosts(id, 0)
      if (!res.error) {
        posts = serializeProfilePostsResponse(res.posts)
      }
    } catch (_) {
      console.error('Error while fetching posts for user', id)
    }
    return { me: false, profile, posts, canId }
  }
}
