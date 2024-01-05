export const ssr = false

import { individualUser } from '$lib/helpers/backend'
import { getCanisterId } from '$lib/helpers/canisterId'
import { sanitizeProfile } from '$lib/helpers/profile'
import Log from '$lib/utils/Log'
import { userProfile } from '$lib/stores/app'
import { Principal } from '@dfinity/principal'
import { get } from 'svelte/store'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ params, fetch }) => {
  const id = params.id
  const userProfileData = get(userProfile)
  if (
    id === userProfileData.unique_user_name ||
    id === userProfileData.principal_id
  ) {
    return { me: true, profile: userProfileData }
  } else {
    const canId = await getCanisterId(id)
    if (!canId) {
      Log('warn', 'No canister ID', { from: 'loadLovers', id: params.id })
      throw new Error("Couldn't find canister Id")
    }
    const fetchedProfile = await individualUser(
      Principal.from(canId),
      fetch,
    ).get_profile_details()
    const profile = sanitizeProfile(fetchedProfile, id)
    return { me: false, profile }
  }
}
