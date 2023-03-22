import type {
  GetPostsOfUserProfileError,
  MintEvent,
  PostDetailsForFrontend,
  SystemTime,
  TokenEvent,
  UserProfileDetailsForFrontend,
} from '$canisters/individual_user_template/individual_user_template.did'
import { setUserProperties } from '$components/seo/GA.svelte'
import {
  identifyUserGS,
  unidentifyUserGS,
} from '$components/seo/GoSquared.svelte'
import getDefaultImageUrl from '$lib/utils/getDefaultImageUrl'
import Log from '$lib/utils/Log'
import { generateRandomName } from '$lib/utils/randomUsername'
import { authState } from '$stores/auth'
import userProfile, {
  emptyProfileValues,
  type UserProfile,
} from '$stores/userProfile'
import { Principal } from '@dfinity/principal'
import { get } from 'svelte/store'
import { individualUser } from './backend'
import { getCanisterId } from './canisterId'
import { setUser } from './sentry'

export interface UserProfileFollows extends UserProfile {
  i_follow: boolean
}

async function fetchProfile() {
  try {
    return await individualUser().get_profile_details()
  } catch (e) {
    Log({ error: e, from: '1 fetchProfile' }, 'error')
  }
}

type UnionKeyOf<U> = U extends U ? keyof U : never

export function sanitizeProfile(
  profile: UserProfileDetailsForFrontend,
  userId: string,
): UserProfile {
  return {
    username_set: !!profile.unique_user_name[0],
    unique_user_name:
      profile.unique_user_name[0] || generateRandomName('username', userId),
    profile_picture_url:
      profile.profile_picture_url[0] || getDefaultImageUrl(userId),
    display_name: profile.display_name[0] || generateRandomName('name', userId),
    principal_id: profile.principal_id.toText(),
    followers_count: Number(profile.followers_count),
    following_count: Number(profile.followers_count),
    profile_stats: {
      hots_earned_count: Number(profile.profile_stats.hots_earned_count) || 0,
      lifetime_earnings: Number(profile.profile_stats.hots_earned_count) || 0,
      nots_earned_count: Number(profile.profile_stats.hots_earned_count) || 0,
    },
    updated_at: Date.now(),
  }
}

export async function updateProfile(profile?: UserProfileDetailsForFrontend) {
  const authStateData = get(authState)
  if (authStateData.isLoggedIn) {
    const updateProfile = profile || (await fetchProfile())
    if (updateProfile) {
      userProfile.set({
        ...sanitizeProfile(updateProfile, authStateData.idString || 'random'),
      })
      if (updateProfile.unique_user_name[0]) {
        try {
          const { idb } = await import('$lib/idb')
          idb.set(
            'canisters',
            updateProfile.unique_user_name[0],
            authStateData.userCanisterId,
          )
        } catch (e) {
          Log({ error: e, from: '1 updateProfile', type: 'idb' }, 'error')
        }
      }
    } else {
      Log({ error: 'No profile found', from: '1 updateProfile' }, 'error')
    }
  } else {
    userProfile.set(emptyProfileValues)
  }
  updateUserProperties() // GA
  setUser(authStateData.idString) //Sentry
  Log({ profile: get(userProfile), from: '0 updateProfile' }, 'info')
}

async function updateUserProperties() {
  const profile = get(userProfile)
  const authStateData = get(authState)
  if (authStateData.isLoggedIn && profile.principal_id) {
    const res = await fetchTokenBalance()
    setUserProperties({
      display_name: profile.display_name,
      userId: profile.principal_id,
      user_canister_id: authStateData.userCanisterId,
      ...(profile.username_set && { username: profile.unique_user_name }),
      ...(!res.error && { wallet_balance: res.balance }),
    })

    identifyUserGS({
      id: profile.principal_id,
      name: profile.display_name,
      ...(profile.username_set && { username: profile.unique_user_name }),
    })
  } else {
    setUserProperties()
    unidentifyUserGS()
  }
}

type ProfilePostsResponse =
  | {
      error: true
    }
  | {
      error: false
      posts: PostDetailsForFrontend[]
      noMorePosts: boolean
    }

export async function fetchPosts(
  id: string,
  from: number,
): Promise<ProfilePostsResponse> {
  try {
    const canId = await getCanisterId(id)

    const res = await individualUser(
      Principal.from(canId),
    ).get_posts_of_this_user_profile_with_pagination(
      BigInt(from),
      BigInt(from + 10),
    )
    if ('Ok' in res) {
      return {
        error: false,
        posts: res.Ok,
        noMorePosts: res.Ok.length < 10,
      }
    } else if ('Err' in res) {
      type UnionKeyOf<U> = U extends U ? keyof U : never
      type errors = UnionKeyOf<GetPostsOfUserProfileError>
      const err = Object.keys(res.Err)[0] as errors
      switch (err) {
        case 'ExceededMaxNumberOfItemsAllowedInOneRequest':
        case 'InvalidBoundsPassed':
          return { error: true }
        case 'ReachedEndOfItemsList':
          return { error: false, noMorePosts: true, posts: [] }
      }
    } else throw new Error(`Unknown response, ${JSON.stringify(res)}`)
  } catch (e) {
    Log({ error: e, from: '11 fetchPosts' }, 'error')
    return { error: true }
  }
}

export async function fetchLovers(id: string, from: number) {
  try {
    const canId = await getCanisterId(id)

    const res = await individualUser(
      Principal.from(canId),
    ).get_principals_that_follow_me_paginated(BigInt(from), BigInt(from + 15))
    if ('Ok' in res) {
      const populatedUsers = await populateProfiles(res.Ok)
      if (populatedUsers.error) {
        throw new Error(
          `Error while populating, ${JSON.stringify(populatedUsers)}`,
        )
      }
      return {
        error: false,
        lovers: populatedUsers.posts,
        noMoreLovers: res.Ok.length < 10,
      }
    } else if ('Err' in res) {
      type UnionKeyOf<U> = U extends U ? keyof U : never
      type errors = UnionKeyOf<GetPostsOfUserProfileError>
      const err = Object.keys(res.Err)[0] as errors
      switch (err) {
        case 'ExceededMaxNumberOfItemsAllowedInOneRequest':
        case 'InvalidBoundsPassed':
          return { error: true }
        case 'ReachedEndOfItemsList':
          return { error: false, noMoreLovers: true, lovers: [] }
      }
    } else throw new Error(`Unknown response, ${JSON.stringify(res)}`)
  } catch (e) {
    Log({ error: e, from: '11 fetchPosts' }, 'error')
    return { error: true }
  }
}

export async function fetchLovingUsers(id: string, from: number) {
  try {
    const canId = await getCanisterId(id)

    const res = await individualUser(
      Principal.from(canId),
    ).get_principals_i_follow_paginated(BigInt(from), BigInt(from + 15))
    if ('Ok' in res) {
      const populatedUsers = await populateProfiles(res.Ok)
      if (populatedUsers.error) {
        throw new Error(
          `Error while populating, ${JSON.stringify(populatedUsers)}`,
        )
      }
      return {
        error: false,
        lovers: populatedUsers.posts,
        noMoreLovers: res.Ok.length < 10,
      }
    } else if ('Err' in res) {
      type UnionKeyOf<U> = U extends U ? keyof U : never
      type errors = UnionKeyOf<GetPostsOfUserProfileError>
      const err = Object.keys(res.Err)[0] as errors
      switch (err) {
        case 'ExceededMaxNumberOfItemsAllowedInOneRequest':
        case 'InvalidBoundsPassed':
          return { error: true }
        case 'ReachedEndOfItemsList':
          return { error: false, noMoreLovers: true, lovers: [] }
      }
    } else throw new Error(`Unknown response, ${JSON.stringify(res)}`)
  } catch (e) {
    Log({ error: e, from: '11 fetchPosts' }, 'error')
    return { error: true }
  }
}

async function populateProfiles(users: Principal[]) {
  try {
    if (!users.length) {
      return { posts: [], error: false }
    }

    const authStateData = get(authState)

    const res = await Promise.all(
      users.map(async (userId) => {
        if (userId?.toText() === '2vxsx-fae') return
        const canId = await getCanisterId(userId.toText())

        if (canId) {
          const r = await individualUser(
            Principal.from(canId),
          ).get_profile_details()

          return {
            ...sanitizeProfile(r, userId.toText()),
            i_follow: authStateData.isLoggedIn
              ? await doIFollowThisUser(userId.toText())
              : false,
          }
        } else {
          Log(
            {
              error: `Could not get canisterId for user: ${userId.toText()}`,
              from: '12 populatePosts.profile',
            },
            'error',
          )
        }
      }),
    )

    return {
      posts: res.filter((o) => !!o) as UserProfileFollows[],
      error: false,
    }
  } catch (e) {
    Log({ error: e, from: '11 populatePosts.profile' }, 'error')
    return { error: true, posts: [] }
  }
}

export async function doIFollowThisUser(
  userId?: string,
  canId?: string | Principal,
) {
  if (!userId) return false

  return await individualUser(canId).get_following_status_do_i_follow_this_user(
    Principal.from(userId),
  )
}

export async function loveUser(userId: string) {
  try {
    const res =
      await individualUser().update_principals_i_follow_toggle_list_with_principal_specified(
        Principal.from(userId),
      )
    if ('Ok' in res) {
      return true
    } else {
      return false
    }
  } catch (e) {
    Log({ error: e, from: '1 loveUser' }, 'error')
    return false
  }
}

export interface TransactionHistory {
  id: BigInt
  type: UnionKeyOf<TokenEvent>
  token: number
  timestamp: SystemTime
  details: MintEvent
}

type HistoryResponse =
  | {
      error: true
    }
  | {
      error: false
      history: TransactionHistory[]
      endOfList: boolean
    }

async function transformHistoryRecords(
  res: Array<[bigint, TokenEvent]>,
  filter?: UnionKeyOf<MintEvent>,
): Promise<TransactionHistory[]> {
  const history: TransactionHistory[] = []

  res.forEach((o) => {
    const obj = o[1]
    const type = Object.keys(obj)[0] as UnionKeyOf<TokenEvent>
    const subType = Object.keys(obj[type].details)[0]
    if (!filter || filter === subType) {
      history.push({
        id: o[0],
        type,
        token: subType === 'NewUserSignup' ? 1000 : 500,
        timestamp: obj[type].timestamp as SystemTime,
        details: obj[type].details as MintEvent,
      })
    }
  })

  return history
}

export async function fetchHistory(
  from: number,
  filter?: UnionKeyOf<MintEvent>,
): Promise<HistoryResponse> {
  try {
    const res =
      await individualUser().get_user_utility_token_transaction_history_with_pagination(
        BigInt(from),
        BigInt(from + 10),
      )
    if ('Ok' in res) {
      const history = await transformHistoryRecords(res.Ok, filter)

      return {
        error: false,
        history,
        endOfList: history.length < 10,
      }
    } else if ('Err' in res) {
      type errors = UnionKeyOf<GetPostsOfUserProfileError>
      const err = Object.keys(res.Err)[0] as errors
      switch (err) {
        case 'InvalidBoundsPassed':
          return { error: true }
        case 'ReachedEndOfItemsList':
          return { error: false, endOfList: true, history: [] }
      }
    } else throw new Error(`Unknown response, ${JSON.stringify(res)}`)
  } catch (e) {
    Log({ error: e, from: '11 fetchHistory' }, 'error')
    return { error: true }
  }
  return { error: true }
}

export async function fetchTokenBalance(): Promise<
  { error: false; balance: number } | { error: true }
> {
  try {
    const res = await individualUser().get_utility_token_balance()
    return { error: false, balance: Number(res) }
  } catch (e) {
    Log({ error: e, from: '11 fetchHistory' }, 'error')
    return { error: true }
  }
}
