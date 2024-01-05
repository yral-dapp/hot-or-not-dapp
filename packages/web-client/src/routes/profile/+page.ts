export const ssr = false

import { authState } from '$lib/stores/auth'
import { userProfile } from '$lib/stores/app'
import { redirect } from '@sveltejs/kit'
import { get } from 'svelte/store'

export const load = async () => {
  const userProfileData = get(userProfile)
  const authStateData = get(authState)

  if (authStateData.isLoggedIn) {
    redirect(
      307,
      `/profile/${
        userProfileData.unique_user_name || userProfileData.principal_id
      }`,
    )
  } else redirect(307, '/menu')
}
