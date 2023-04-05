<script lang="ts" context="module">
type UnionKeyOf<U> = U extends U ? keyof U : never
type BetAPIErrors = UnionKeyOf<BetOnCurrentlyViewingPostError>
</script>

<script lang="ts">
import type {
  BetDirection,
  BetOnCurrentlyViewingPostError,
  PlacedBetDetail,
} from '$canisters/individual_user_template/individual_user_template.did'
import { registerEvent } from '$components/seo/GA.svelte'
import { individualUser } from '$lib/helpers/backend'
import { getCanisterId } from '$lib/helpers/canisterId'
import type { PostPopulated } from '$lib/helpers/feed'
import { fetchTokenBalance, setBetDetailToDb } from '$lib/helpers/profile'
import type { IDB } from '$lib/idb'
import Log from '$lib/utils/Log'
import { authState } from '$stores/auth'
import { Principal } from '@dfinity/principal'
import HotOrNotBetControls, {
  type BetDirectionString,
  type PlaceBet,
} from './HotOrNotBetControls.svelte'
import HotOrNotBetOutcome from './HotOrNotBetOutcome.svelte'

export let tutorialMode = false
export let disabled = false
export let comingSoon = false
export let post: PostPopulated | undefined = undefined
export let fetchPlacedBetDetail = false
export let inView = false
export let profileUserId: string | undefined = undefined
export let placedBetDetail: PlacedBetDetail | undefined = undefined
export let me = false

$: bettingStatus = post?.hot_or_not_betting_status?.[0]
$: bettingStatusValue = Object.values(bettingStatus || {})?.[0]

let betPlaced: false | BetDirectionString = false
let loadingWithDirection: false | BetDirectionString = false

let error = ''
let idb: IDB

$: if (bettingStatusValue?.has_this_user_participated_in_this_post?.[0]) {
  error = 'You have already placed a bet. Fetching your bet info...'
  updatePlacedBetDetail()
} else if (!bettingStatusValue) {
  error = 'Betting has been closed.'
}

$: if (inView && fetchPlacedBetDetail) {
  updatePlacedBetDetail()
} else if (!fetchPlacedBetDetail && !placedBetDetail) {
  getBetDetailFromDb()
}

async function getBetDetailFromDb() {
  if (!post) return
  if (!idb) {
    try {
      idb = (await import('$lib/idb')).idb
    } catch (e) {
      Log({ error: e, source: '1 saveBetToDb', type: 'idb' }, 'error')
      return
    }
  }
  try {
    placedBetDetail = (await idb.get(
      'bets',
      post.publisher_canister_id + '@' + post.post_id,
    )) as PlacedBetDetail
  } catch (e) {
    Log({ error: e, source: '2 saveBetToDb', type: 'idb' }, 'error')
    return
  }
}

async function updatePlacedBetDetail() {
  try {
    if (!post?.publisher_canister_id) return
    if (profileUserId) profileUserId = await getCanisterId(profileUserId)
    error = ''
    const res = await individualUser(
      profileUserId,
    ).get_individual_hot_or_not_bet_placed_by_this_profile(
      Principal.from(post.publisher_canister_id),
      post.id,
    )
    placedBetDetail = res[0]
    if (placedBetDetail) {
      setBetDetailToDb(post, placedBetDetail)
    } else {
      throw 'No bet found'
    }
  } catch (e) {
    //TODO: Add retries
    Log({ error: e, source: '1 updatePlacedBetDetail' }, 'error')
    error = 'Error fetching your bet details'
  }
}

async function getWalletBalance() {
  const res = await fetchTokenBalance()
  if (res.error) {
    throw res.error
  } else {
    return res.balance
  }
}

async function placeBet({ coins, direction }: PlaceBet) {
  try {
    if (loadingWithDirection) return
    if (!$authState.isLoggedIn) {
      $authState.showLogin = true
      return
    }
    if (!post?.publisher_canister_id) return

    loadingWithDirection = direction

    const bet_direction = {
      [direction]: null,
    } as BetDirection

    const betRes = await individualUser().bet_on_currently_viewing_post({
      bet_amount: BigInt(coins),
      bet_direction,
      post_id: post.id,
      post_canister_id: Principal.from(post.publisher_canister_id),
    })

    if ('Ok' in betRes) {
      betPlaced = direction

      placedBetDetail = {
        amount_bet: BigInt(coins),
        outcome_received: {
          AwaitingResult: null,
        },
        bet_direction,
        bet_placed_at: {
          nanos_since_epoch: 1000,
          secs_since_epoch: BigInt(Math.floor(new Date().getTime() / 1000)),
        },
        slot_id: bettingStatusValue?.ongoing_slot || 1,
        canister_id: Principal.from(post.publisher_canister_id),
        post_id: post.id,
        room_id: bettingStatusValue?.ongoing_room || BigInt(1),
      }

      registerEvent('bet_placed', {
        bet_direction: direction,
        bet_amount: coins,
        bet_placed_by_id: $authState.idString,
        bet_placed_by_canister_id: $authState.userCanisterId,
        post_publisher_canister_id: post.publisher_canister_id,
        post_id: post.id,
        post_uid: `${post.publisher_canister_id}@${post.id}`,
      })
      setBetDetailToDb(post, placedBetDetail)
    } else {
      const err = Object.keys(betRes.Err)[0] as BetAPIErrors
      switch (err) {
        case 'BettingClosed':
          disabled = true
          error = 'Betting has been closed'
          break
        case 'InsufficientBalance':
          const balance = await getWalletBalance()
          error = `You do not have enough tokens to bet. Your wallet balance is ${balance} tokens.`
          break
        case 'UserAlreadyParticipatedInThisPost':
          error = 'You have already bet on this post. Fetching details...'
          updatePlacedBetDetail()
          break
        case 'UserNotLoggedIn':
          $authState.showLogin = true
          break
        default:
          throw ''
      }
      loadingWithDirection = false
    }
  } catch (e) {
    Log({ error: e, postId: post?.id, from: 'placeBet 1' }, 'error')
    loadingWithDirection = false
    error = 'Something went wrong while placing bet. Please try again'
    setTimeout(() => {
      error = ''
    }, 2000)
  }
}

// $: if (inView && !error && !disabled) {
//   updatebettingStatus()
// }

// async function updatebettingStatus() {
//   try {
//     const res = await individualUser().get_hot_or_not_bet_details_for_this_post(
//       postId,
//     )
//   } catch (e) {
//     //TODO: Add retries
//     error = 'Error fetching your bet details'
//   }
// }
</script>

<hot-or-not class="pointer-events-none block h-full w-full">
  {#if comingSoon}
    <div
      class="absolute inset-0 bottom-0 z-50 flex items-center justify-center">
      <div
        class="rounded-md bg-white p-4 text-center text-sm text-black drop-shadow-md">
        Coming Soon
      </div>
    </div>
  {:else if error}
    <div
      class="absolute inset-0 bottom-0 z-50 flex items-center justify-center px-4">
      <div
        class="rounded-md bg-white px-2 py-3 text-center text-sm text-black drop-shadow-md">
        {error}
      </div>
    </div>
  {/if}
  {#if betPlaced === false && !fetchPlacedBetDetail && !placedBetDetail}
    <HotOrNotBetControls
      on:placeBet={({ detail }) => placeBet(detail)}
      {tutorialMode}
      disabled={disabled || !!error}
      {betPlaced}
      {loadingWithDirection} />
  {:else if placedBetDetail}
    <HotOrNotBetOutcome
      {me}
      {placedBetDetail}
      postCreatedAt={post?.created_at} />
  {/if}
</hot-or-not>
