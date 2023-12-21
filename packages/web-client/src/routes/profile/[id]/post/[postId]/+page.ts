export const ssr = false

import { individualUser } from '$lib/helpers/backend'
import { getCanisterId } from '$lib/helpers/canisterId'
import type { PostPopulated } from '$lib/helpers/feed'
import Log from '$lib/utils/Log'
import userProfile from '$lib/stores/userProfile'
import { Principal } from '@dfinity/principal'
import { redirect } from '@sveltejs/kit'
import { get } from 'svelte/store'
import type { PageLoad } from './$types'
import getDefaultImageUrl from '$lib/utils/getDefaultImageUrl'

export const load: PageLoad = async ({ params, fetch }) => {
  try {
    const pid = params.postId
    const id = params.id
    let me = false
    if (!pid || isNaN(Number(pid))) {
      Log('warn', 'Invalid post ID', { from: 'loadProfilePostId', pid, id })
      redirect(307, '/profile')
    }

    const canId = await getCanisterId(id)
    if (!canId) {
      redirect(307, '/profile')
      return
    }

    const userProfileData = get(userProfile)

    if (
      id === userProfileData.unique_user_name ||
      id === userProfileData.principal_id
    ) {
      me = true
    }

    const post = await individualUser(
      Principal.from(canId),
      fetch,
    ).get_individual_post_details_by_id(BigInt(pid))

    const video: PostPopulated = {
      ...post,
      post_id: BigInt(pid),
      publisher_canister_id: canId,
      score: BigInt(0),
      created_by_profile_photo_url:
        post.created_by_profile_photo_url[0] ||
        getDefaultImageUrl(post.created_by_user_principal_id, 54),
      created_by_user_principal_id: post.created_by_user_principal_id.toText(),
    }
    if (!video) {
      redirect(307, '/profile')
    }
    return { me, video }
  } catch (e) {
    Log('warn', 'Invalid post ID', {
      from: 'loadProfilePostId',
      e,
      id: params.id,
      postId: params.postId,
    })

    redirect(307, '/profile')
  }
}
