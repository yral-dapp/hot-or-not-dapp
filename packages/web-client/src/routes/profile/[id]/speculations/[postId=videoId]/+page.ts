export const ssr = false

import { individualUser } from '$lib/helpers/backend'
import { getCanisterId } from '$lib/helpers/canisterId'
import {
  setBetDetailToDb,
  type PostPopulatedWithBetDetails,
} from '$lib/helpers/profile'
import Log from '$lib/utils/Log'
import userProfile from '$stores/userProfile'
import { Principal } from '@dfinity/principal'
import { redirect } from '@sveltejs/kit'
import { get } from 'svelte/store'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ params, fetch }) => {
  try {
    const postIdArr = params.postId.split('@')
    const profileId = params.id
    const postId = BigInt(postIdArr[1])
    let me = false

    const canId = await getCanisterId(profileId)
    if (!canId) {
      throw redirect(307, '/profile')
    }

    const userProfileData = get(userProfile)

    if (
      [userProfileData.unique_user_name, userProfileData.principal_id].includes(
        profileId,
      )
    ) {
      me = true
    }

    const postRes = await individualUser(
      Principal.from(postIdArr[0]),
      fetch,
    ).get_individual_post_details_by_id(postId)

    //TODO: Fetch PlacedBetDetail from idb cache

    const betDetail = await individualUser(
      Principal.from(canId),
      fetch,
    ).get_individual_hot_or_not_bet_placed_by_this_profile(
      Principal.from(postIdArr[0]),
      postId,
    )

    if (!betDetail[0]) {
      throw redirect(307, '/profile')
    }

    const post: PostPopulatedWithBetDetails = {
      ...postRes,
      post_id: postId,
      score: BigInt(0),
      publisher_canister_id: canId,
      created_by_user_principal_id:
        postRes.created_by_user_principal_id.toText(),
      placed_bet_details: betDetail[0],
    }

    setBetDetailToDb(post, betDetail[0])

    return { me, post }
  } catch (e) {
    Log({ from: '1 posts/[vid] load', error: e }, 'warn')
    throw redirect(307, '/profile')
  }
}
