export const ssr = false

import type { PageLoad } from './$types'
import { redirect } from '@sveltejs/kit'
import { postCache } from '$lib/helpers/backend'

export const load: PageLoad = async ({ fetch }) => {
  const res = await postCache(
    fetch,
  ).get_top_posts_aggregated_from_canisters_on_this_network_for_hot_or_not_feed(
    BigInt(0),
    BigInt(1),
  )

  if ('Ok' in res && res.Ok[0]) {
    throw redirect(
      307,
      `/hotornot/${res.Ok[0].publisher_canister_id.toText()}@${
        res.Ok[0].post_id
      }`,
    )
  } else {
    throw redirect(307, '/hotornot/no-videos')
  }
}
