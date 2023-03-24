<script lang="ts">
import type {
  BetDirection,
  BetOnCurrentlyViewingPostError,
  BettingStatus,
} from '$canisters/individual_user_template/individual_user_template.did'
import IconButton from '$components/button/IconButton.svelte'
import BetCoinIcon from '$components/icons/BetCoinIcon.svelte'
import ChevronUpIcon from '$components/icons/ChevronUpIcon.svelte'
import HotIcon from '$components/icons/HotIcon.svelte'
import LoadingIcon from '$components/icons/LoadingIcon.svelte'
import NotIcon from '$components/icons/NotIcon.svelte'
import TimerIcon from '$components/icons/TimerIcon.svelte'
import { individualUser } from '$lib/helpers/backend'
import { fetchTokenBalance } from '$lib/helpers/profile'
import Log from '$lib/utils/Log'
import { authState } from '$stores/auth'
import c from 'clsx'
import { fade } from 'svelte/transition'

export let tutorialMode = false
export let disabled = false
export let comingSoon = false
export let betStatus: BettingStatus | undefined = undefined
export let postId: bigint
export let inView = false

let betPlaced: false | 'hot' | 'not' = false
let betResult: 'pending' | 'lost' | 'won' | 'draw' = 'pending'
let coinsBetPlaced = 10
let selectedCoins = 10
let loading = false
let tempPlacedBet: false | 'hot' | 'not' = false
let error = ''
let timeLeft = '59m 10s'

$: if (
  betStatus?.['BettingOpen']?.['has_this_user_participated_in_this_post']?.[0]
) {
  error = 'You have already placed a bet on this post'
} else if (betStatus && 'BettingClosed' in betStatus) {
  error = 'Betting has been closed'
}

$: if (inView && !error && !disabled) {
  updateBetStatus()
}

async function updateBetStatus() {
  try {
    const res = await individualUser().get_hot_or_not_bet_details_for_this_post(
      postId,
    )
  } catch (e) {
    //TODO: Add retries
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

async function placeBet(bet: 'hot' | 'not') {
  try {
    loading = true
    tempPlacedBet = bet

    let bet_direction: BetDirection | null = null
    if (tempPlacedBet === 'hot') {
      bet_direction = {
        Hot: null,
      }
    } else {
      bet_direction = {
        Not: null,
      }
    }

    if (!bet_direction) return

    const betRes = await individualUser().bet_on_currently_viewing_post({
      bet_amount: BigInt(selectedCoins),
      bet_direction,
      post_id: postId,
    })

    console.log({ betRes })

    if ('Ok' in betRes) {
      betPlaced = tempPlacedBet
    } else {
      type UnionKeyOf<U> = U extends U ? keyof U : never
      type errors = UnionKeyOf<BetOnCurrentlyViewingPostError>
      const err = Object.keys(betRes.Err)[0] as errors
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
          error = 'You have already bet on this post'
          break
        case 'UserNotLoggedIn':
          $authState.showLogin = true
          break
        default:
          throw ''
      }
      tempPlacedBet = false
      loading = false
    }
  } catch (e) {
    Log({ error: e, postId, from: 'placeBet 1' }, 'error')
    tempPlacedBet = false
    loading = false
    error = 'Something went wrong while placing bet. Please try again'
    setTimeout(() => {
      error = ''
    }, 2000)
  }
}

function increaseBet() {
  if (selectedCoins == 10) selectedCoins = 50
  else if (selectedCoins == 50) selectedCoins = 100
}

function decreaseBet() {
  if (selectedCoins == 50) selectedCoins = 10
  else if (selectedCoins == 100) selectedCoins = 50
}

function toggleBet() {
  if (selectedCoins == 100) selectedCoins = 10
  else increaseBet()
}
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
      class="absolute inset-0 bottom-0 z-50 flex items-center justify-center">
      <div
        class="rounded-md bg-white p-4 text-center text-sm text-black drop-shadow-md">
        {error}
      </div>
    </div>
  {/if}
  {#if betPlaced === false}
    <div
      class="pointer-events-none absolute inset-0 top-0 flex items-center justify-center space-x-8 px-4"
      transition:fade|local>
      <div
        class="relative flex flex-col items-center space-y-1 {error
          ? 'pointer-events-none'
          : 'pointer-events-auto'}">
        {#if tutorialMode}
          <div
            class="absolute -top-2 z-[-1] h-36 w-36 rounded-full bg-white/10" />
        {/if}
        <IconButton
          disabled={tutorialMode || disabled}
          on:click={(e) => {
            e.stopImmediatePropagation()
            placeBet('not')
          }}>
          <NotIcon
            class={c('h-24 transition-transform', {
              'scale-110': tempPlacedBet === 'not',
              'scale-90 grayscale': tempPlacedBet === 'hot',
            })} />
        </IconButton>
        <span class="text-sm">Not</span>
      </div>
      <div
        class={c(
          'relative flex flex-col items-center',
          tutorialMode || error
            ? '!pointer-events-none'
            : 'pointer-events-auto',
          {
            'opacity-0': tutorialMode,
          },
        )}>
        <IconButton
          disabled={selectedCoins == 100 || disabled}
          on:click={(e) => {
            e.stopImmediatePropagation()
            increaseBet()
          }}
          class={c('z-[10] flex items-center p-4 disabled:opacity-50', {
            invisible: betPlaced || tempPlacedBet,
          })}>
          <ChevronUpIcon class="h-2" />
        </IconButton>
        <button
          disabled={betPlaced !== false || tempPlacedBet !== false || disabled}
          on:click|stopPropagation={toggleBet}
          class="relative h-20 w-20 select-none disabled:grayscale">
          <BetCoinIcon class="h-20" />
          <div
            class="absolute inset-0 flex select-none items-center justify-center">
            {#if loading}
              <LoadingIcon class="h-8 w-8 animate-spin" />
            {:else}
              <span
                style="text-shadow: 3px 3px 0 #EA9C00;"
                class="select-none text-3xl font-extrabold text-[#FFCC00]">
                {selectedCoins}
              </span>
            {/if}
          </div>
        </button>
        <IconButton
          on:click={(e) => {
            e.stopImmediatePropagation()
            decreaseBet()
          }}
          disabled={selectedCoins == 10 || disabled}
          class={c('z-[10] flex items-center p-4 disabled:opacity-50', {
            invisible: betPlaced || tempPlacedBet,
          })}>
          <ChevronUpIcon class="h-2 rotate-180" />
        </IconButton>
      </div>
      <div
        class="relative flex flex-col items-center space-y-1 {error
          ? 'pointer-events-none'
          : 'pointer-events-auto'}">
        {#if tutorialMode}
          <div
            class="absolute -top-2 z-[-1] h-36 w-36 rounded-full bg-white/10" />
        {/if}
        <IconButton
          disabled={tutorialMode || disabled}
          on:click={(e) => {
            e.stopImmediatePropagation()
            placeBet('hot')
          }}>
          <HotIcon
            class={c('h-24 transition-transform', {
              'scale-110': tempPlacedBet === 'hot',
              'scale-90 grayscale': tempPlacedBet === 'not',
            })} />
        </IconButton>
        <span class="text-sm">Hot</span>
      </div>
    </div>
  {:else}
    <div transition:fade class="flex h-full w-full items-center space-x-8 px-4">
      <div
        class={c('flex items-center', {
          'translate-y-4 -space-y-8 -space-x-8': betResult !== 'pending',
          'space-x-2': betResult === 'pending',
        })}>
        <div class="z-[2] shrink-0">
          {#if betPlaced === 'hot'}
            <HotIcon class="h-16" />
          {:else if betPlaced === 'not'}
            <NotIcon class="h-16" />
          {/if}
        </div>
        <div class="relative z-[1] h-16 w-16 shrink-0">
          <BetCoinIcon class="h-16" />
          <span
            style="text-shadow: 3px 3px 0 #EA9C00;"
            class="absolute inset-0 flex select-none items-center justify-center text-2xl font-extrabold text-[#ffeea8]">
            {coinsBetPlaced}
          </span>
        </div>
      </div>
      {#if betResult === 'pending'}
        <div class="flex shrink-0 grow flex-col space-y-2">
          <span class="text-sm">
            Your bet: {coinsBetPlaced} coins on {betPlaced}
          </span>
          <div
            class="flex grow items-center justify-center space-x-2 rounded-full bg-primary px-3 py-2 shadow-button-primary">
            <TimerIcon class="h-5 w-5" />
            <span class="font-bold text-white">{timeLeft}</span>
          </div>
        </div>
      {:else}
        <div class="flex shrink-0 grow flex-col space-y-2">
          <span class="text-sm">
            Your bet: {coinsBetPlaced} coins on {betPlaced}
          </span>
          <div
            class="flex grow items-center justify-center space-x-2 rounded-full px-3 py-2 {betResult ===
            'won'
              ? 'bg-green-500'
              : 'bg-red-500'}">
            <span class="font-bold text-white">You {betResult}</span>
          </div>
        </div>
      {/if}
    </div>
  {/if}
</hot-or-not>
