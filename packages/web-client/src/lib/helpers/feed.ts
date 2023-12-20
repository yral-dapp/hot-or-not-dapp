import type { PostDetailsForFrontend } from '$canisters/individual_user_template/individual_user_template.did'
import type {
  PostScoreIndexItem,
  TopPostsFetchError,
} from '$canisters/post_cache/post_cache.did'
import type { IDB } from '$lib/idb'
import Log from '$lib/utils/Log'
import { Principal } from '@dfinity/principal'
import { individualUser, postCache } from './backend'
import { setBetDetailToDb } from './profile'
import sleep from '$lib/utils/sleep'
import { chunk } from '$lib/utils/chunk'

export interface PostPopulated
  extends Omit<PostScoreIndexItem, 'publisher_canister_id'>,
    Omit<PostDetailsForFrontend, 'created_by_user_principal_id'> {
  created_by_user_principal_id: string
  publisher_canister_id: string
}

let idb: IDB | null = null

export interface PostPopulatedHistory extends PostPopulated {
  watched_at: number
}

export type FeedResponse =
  | {
      posts: PostPopulated[]
      error: false
      from: number
      noMorePosts: boolean
    }
  | {
      error: true
    }

async function filterPosts(
  posts: PostScoreIndexItem[],
  dbStore: 'watch' | 'watch-hon',
): Promise<PostScoreIndexItem[]> {
  try {
    if (!idb) {
      idb = (await import('$lib/idb')).idb
    }
    const keys = (await idb.keys(dbStore)) as string[]
    if (!keys?.length) return posts
    const filtered = posts.filter(
      (o) => !keys.includes(o.publisher_canister_id.toText() + '@' + o.post_id),
    )
    return filtered
  } catch (e) {
    Log('error', 'Error while accessing IDB', {
      error: e,
      from: 'feed.filterPosts',
      type: 'idb',
    })
    return posts
  }
}

async function filterReportedPosts(posts: PostScoreIndexItem[]) {
  try {
    if (!idb) {
      idb = (await import('$lib/idb')).idb
    }
    const keys = (await idb.keys('reported')) as string[]
    if (!keys?.length) return posts
    const filtered = posts.filter(
      (o) => !keys.includes(o.publisher_canister_id.toText() + '@' + o.post_id),
    )
    return filtered
  } catch (e) {
    Log('error', 'Error while accessing IDB', {
      error: e,
      from: 'feed.filterReportedPosts',
      type: 'idb',
    })
    return posts
  }
}

async function filterStuckCanisterPosts(posts: PostScoreIndexItem[]) {
  try {
    const stuckCanisters = [
      '6l6jz-kaaaa-aaaao-actmq-cai',
      'rw62l-xyaaa-aaaao-aayca-cai',
      '4thmb-taaaa-aaaao-aavfq-cai',
      'du74r-syaaa-aaaao-aa47q-cai',
      'u6qff-cqaaa-aaaao-aczfa-cai',
    ]
    return posts.filter(
      (o) => !stuckCanisters.includes(o.publisher_canister_id.toText()),
    )
  } catch (e) {
    Log('error', 'Error while accessing IDB', {
      error: e,
      from: 'feed.filterReportedPosts',
      type: 'idb',
    })
    return posts
  }
}

export async function getWatchedVideosFromCache(
  dbStore: 'watch' | 'watch-hon',
): Promise<PostPopulatedHistory[]> {
  try {
    if (!idb) {
      idb = (await import('$lib/idb')).idb
    }
    const values = ((await idb.values(dbStore)) || []).slice(
      50,
    ) as PostPopulatedHistory[]
    if (!values.length) return []
    const sorted = values.sort((a, b) => a.watched_at - b.watched_at)
    return sorted
  } catch (e) {
    Log('error', 'Error while accessing IDB', {
      error: e,
      from: 'feed.getWatchedVideosFromCache',
      type: 'idb',
    })
    return []
  }
}

export async function getTopPosts(
  from: number,
  numberOfPosts: number = 10,
  filterViewed = false,
): Promise<FeedResponse> {
  try {
    const res =
      await postCache().get_top_posts_aggregated_from_canisters_on_this_network_for_home_feed(
        BigInt(from),
        BigInt(from + numberOfPosts),
      )
    if ('Ok' in res) {
      const nonReportedPosts = await filterReportedPosts(res.Ok)
      const notStuckPosts = await filterStuckCanisterPosts(nonReportedPosts)
      const notWatchedPosts = await filterPosts(notStuckPosts, 'watch')
      const populatedRes = await populatePosts(
        filterViewed ? notWatchedPosts : notStuckPosts,
      )
      if (populatedRes.error) {
        throw new Error(
          `Error while populating, ${JSON.stringify(populatedRes)}`,
        )
      }
      return {
        error: false,
        from: from + res.Ok.length,
        posts: populatedRes.posts,
        noMorePosts: res.Ok.length < numberOfPosts,
      }
    } else if ('Err' in res) {
      type UnionKeyOf<U> = U extends U ? keyof U : never
      type errors = UnionKeyOf<TopPostsFetchError>
      const err = Object.keys(res.Err)[0] as errors
      switch (err) {
        case 'InvalidBoundsPassed':
        case 'ExceededMaxNumberOfItemsAllowedInOneRequest':
          return { error: true }
        case 'ReachedEndOfItemsList':
          return { error: false, noMorePosts: true, from, posts: [] }
      }
    } else throw new Error(`Unknown response, ${JSON.stringify(res)}`)
  } catch (e) {
    Log('error', 'Error while loading posts', {
      error: e,
      from: 'feed.getTopPosts',
    })
    return { error: true }
  }
}

async function filterBets(
  posts: PostScoreIndexItem[],
): Promise<PostScoreIndexItem[]> {
  try {
    if (!idb) {
      idb = (await import('$lib/idb')).idb
    }
    const keys = (await idb.keys('bets')) as string[]
    if (!keys?.length) return posts
    const filtered = posts.filter(
      (o) => !keys.includes(o.publisher_canister_id.toText() + '@' + o.post_id),
    )
    return filtered
  } catch (e) {
    Log('error', 'Error while accessing IDB', {
      error: e,
      from: 'feed.filterPosts',
      type: 'idb',
    })
    return posts
  }
}

export async function getHotOrNotPosts(
  from: number,
  numberOfPosts: number = 10,
): Promise<FeedResponse> {
  try {
    console.info('1. Fetching videos from index canister for hot or not feed', {
      from,
      numberOfPosts,
    })
    const res =
      await postCache().get_top_posts_aggregated_from_canisters_on_this_network_for_hot_or_not_feed(
        BigInt(from),
        BigInt(from + numberOfPosts),
      )
    if ('Ok' in res) {
      console.log('2. Fetched videos from index canister', res.Ok)
      const notBetPosts = await filterBets(res.Ok)
      console.log(
        '3. Filtered videos that user have already bet on',
        notBetPosts,
      )
      const notStuckPosts = await filterStuckCanisterPosts(notBetPosts)
      console.log('4. Filtered blacklist canister videos', notStuckPosts)
      const notReportedPosts = await filterReportedPosts(notStuckPosts)
      console.log('5. Filtered not reported posts', notReportedPosts)
      // const notWatchedPosts = await filterPosts(notReportedPosts, 'watch-hon')
      const populatedRes = await populatePosts(notReportedPosts, true)
      console.warn('7. Final Populated posts', populatedRes)
      if (populatedRes.error) {
        throw new Error(
          `Error while populating, ${JSON.stringify(populatedRes)}`,
        )
      }
      return {
        error: false,
        from: from + res.Ok.length,
        posts: populatedRes.posts,
        noMorePosts: res.Ok.length < numberOfPosts,
      }
    } else if ('Err' in res) {
      type UnionKeyOf<U> = U extends U ? keyof U : never
      type errors = UnionKeyOf<TopPostsFetchError>
      const err = Object.keys(res.Err)[0] as errors
      switch (err) {
        case 'InvalidBoundsPassed':
        case 'ExceededMaxNumberOfItemsAllowedInOneRequest':
          return { error: true }
        case 'ReachedEndOfItemsList':
          return { error: false, noMorePosts: true, from, posts: [] }
      }
    } else throw new Error(`Unknown response, ${JSON.stringify(res)}`)
  } catch (e) {
    console.log(
      'ERROR @ Fetching videos from index canister for hot or not feed',
    )
    Log('error', 'Error while loading posts', {
      error: e,
      from: 'feed.getHotOrNotPosts',
    })
    return { error: true }
  }
}

export function isBettingClosed(post: PostDetailsForFrontend) {
  const bettingStatus = post.hot_or_not_betting_status?.[0]
  const bettingStatusValue = Object.values(bettingStatus || {})?.[0]
  if (!bettingStatusValue) {
    return true
  }
  const betWillCloseAt = new Date(
    Number(bettingStatusValue.started_at.secs_since_epoch) * 1000,
  )
  betWillCloseAt.setHours(betWillCloseAt.getHours() + 48)
  if (betWillCloseAt.getTime() - new Date().getTime() > 0) {
    return false
  }
  return true
}

function hasUserBetOnPost(post: PostDetailsForFrontend) {
  const bettingStatus = post.hot_or_not_betting_status?.[0]
  const bettingStatusValue = Object.values(bettingStatus || {})?.[0]

  console.log('betting status', bettingStatus)

  if (!bettingStatusValue) {
    return true
  }
  if (bettingStatusValue.has_this_user_participated_in_this_post[0]) {
    return true
  }
  return false
}

async function fetchPostDetailById(
  post: PostScoreIndexItem,
  filterBetPosts = false,
) {
  try {
    console.log(
      '6. Populating post id:',
      post.publisher_canister_id.toText() + '@' + Number(post.post_id),
    )
    const r = await individualUser(
      Principal.from(post.publisher_canister_id),
    ).get_individual_post_details_by_id(post.post_id)
    if (filterBetPosts && isBettingClosed(r)) {
      console.error(
        '6E2. Bet closed, Not including post id:',
        post.publisher_canister_id.toText() + '@' + Number(post.post_id),
        'POST WAS CREATED AT:',
        new Date(Number(r.created_at.secs_since_epoch) * 1000).toDateString(),
      )
      // Log('warn', 'Betting closed on post', {
      //   post,
      //   from: 'feed.populatePosts.fetch',
      // })

      return undefined
    }
    if (filterBetPosts && hasUserBetOnPost(r)) {
      // Log('warn', 'Already bet on post', {
      //   post,
      //   from: 'feed.populatePosts.fetch',
      // })
      console.error(
        '6E2. Bet placed, Not including post id:',
        post.publisher_canister_id.toText() + '@' + Number(post.post_id),
        'POST WAS CREATED AT:',
        new Date(Number(r.created_at.secs_since_epoch) * 1000).toDateString(),
      )

      return undefined
    }

    return {
      ...r,
      ...post,
      created_by_user_principal_id: r.created_by_user_principal_id.toText(),
      publisher_canister_id: post.publisher_canister_id.toText(),
    } as PostPopulated
  } catch (e) {
    console.error(
      '6E3. Could not populate post, network error',
      post.publisher_canister_id.toText() + '@' + Number(post.post_id),
    )
    // Log('error', 'Error while populating post', {
    //   error: e,
    //   post,
    //   from: 'feed.populatePosts.fetch',
    // })
    return undefined
  }
}

async function populatePosts(
  posts: PostScoreIndexItem[],
  filterBetPosts = false,
) {
  try {
    if (!posts.length) {
      return { posts: [], error: false }
    }

    const populatedPosts: PostPopulated[] = []

    const chunkedPosts = chunk(posts, 10)
    while (chunkedPosts.length) {
      const batch = chunkedPosts.shift()
      if (batch) {
        const results = await Promise.all(
          batch.map((post) => fetchPostDetailById(post, filterBetPosts)),
        )
        populatedPosts.push(...(results.filter((o) => !!o) as PostPopulated[]))
        await sleep(200)
      }
    }

    return {
      posts: populatedPosts,
      error: false,
    }
  } catch (e) {
    Log('error', 'Error while loading posts', {
      error: e,
      from: 'feed.populatePosts',
    })
    return { error: true, posts: [] }
  }
}

export async function updatePostInWatchHistory(
  store: 'watch-hon' | 'watch',
  post: PostPopulated,
  update?: Partial<PostPopulated>,
) {
  if (!post) return
  const postHistory: PostPopulatedHistory = {
    ...post,
    ...update,
    watched_at: Date.now(),
  }
  try {
    if (!idb) {
      idb = (await import('$lib/idb')).idb
    }
    await idb.set(
      store,
      post.publisher_canister_id + '@' + post.post_id,
      postHistory,
    )
  } catch (e) {
    Log('error', 'Error while accessing IDB', {
      error: e,
      from: 'feed.updatePostInWatchHistory',
      type: 'idb',
    })
  }
}

export async function saveReportedPostInDb(postId: string, reason: string) {
  try {
    if (!idb) {
      idb = (await import('$lib/idb')).idb
    }
    await idb.set('reported', postId, reason)
  } catch (e) {
    Log('error', 'Error while accessing IDB', {
      error: e,
      from: 'feed.saveReportedPostInDb',
      type: 'idb',
    })
  }
}
