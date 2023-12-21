export const ssr = true
export const prerender = false

import { Principal } from '@dfinity/principal'
import type { PageLoad } from './$types'
import type { PostPopulated } from '$lib/helpers/feed'
import { individualUser } from '$lib/helpers/backend'
import getDefaultImageUrl from '$lib/utils/getDefaultImageUrl'
import { browser } from '$app/environment'

export const load: PageLoad = async ({ params }) => {
  try {
    const id = params.id.split('@')
    const postId = BigInt(Number(id[1]))
    const principal = Principal.from(id[0])

    console.log({ browser })

    console.time('fetch:hotornot')
    const r =
      await individualUser(principal).get_individual_post_details_by_id(postId)
    console.timeEnd('fetch:hotornot')
    if (r.video_uid) {
      return {
        post: {
          ...r,
          publisher_canister_id: id[0],
          created_by_profile_photo_url:
            r.created_by_profile_photo_url[0] ||
            getDefaultImageUrl(r.created_by_user_principal_id, 54),
          created_by_user_principal_id: r.created_by_user_principal_id.toText(),
          post_id: postId,
          score: BigInt(0),
        } as PostPopulated,
      }
    } else {
      return
    }
  } catch (e) {
    return
  }
}
