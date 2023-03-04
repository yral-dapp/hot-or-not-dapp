<script lang="ts">
import type { BettingStatus } from '$canisters/individual_user_template/individual_user_template.did'
import IconButton from '$components/button/IconButton.svelte'
import BetCoinIcon from '$components/icons/BetCoinIcon.svelte'
import ChevronUpIcon from '$components/icons/ChevronUpIcon.svelte'
import HotIcon from '$components/icons/HotIcon.svelte'
import LoadingIcon from '$components/icons/LoadingIcon.svelte'
import NotIcon from '$components/icons/NotIcon.svelte'
import TimerIcon from '$components/icons/TimerIcon.svelte'
import UserAvatarIcon from '$components/icons/UserAvatarIcon.svelte'
import WalletIcon from '$components/icons/WalletIcon.svelte'
import c from 'clsx'
import { fade } from 'svelte/transition'

export let tutorialMode = false
export let slotsFull = false
export let betStatus: BettingStatus | undefined = undefined

let betPlaced: false | 'hot' | 'not' = false
let betResult: 'pending' | 'lost' | 'won' | 'draw' = 'pending'
let coinsBet = 10
let loading = false
let tempPlacedBet: false | 'hot' | 'not' = false
let error = 'Coming soon'

async function placeBet(bet: 'hot' | 'not') {
  try {
    loading = true
    tempPlacedBet = bet
    setTimeout(() => {
      betPlaced = bet
      loading = false
    }, 2000)
  } catch (e) {
    error = 'Something went wrong. Please try again'
    error =
      'You do not have enough tokens to bet. Your wallet balance is 5 tokens.'
    setTimeout(() => {
      error = ''
    }, 2000)
  }
}

function increaseBet() {
  if (coinsBet == 10) coinsBet = 50
  else if (coinsBet == 50) coinsBet = 100
}

function decreaseBet() {
  if (coinsBet == 50) coinsBet = 10
  else if (coinsBet == 100) coinsBet = 50
}

function toggleBet() {
  if (coinsBet == 100) coinsBet = 10
  else increaseBet()
}
</script>

<hot-or-not class="pointer-events-none w-full">
  {#if betPlaced === false}
    <div
      class="pointer-events-none absolute inset-0 top-0  flex items-center justify-center space-x-8 px-4"
      transition:fade>
      <div
        class="pointer-events-auto relative flex flex-col items-center space-y-1">
        {#if tutorialMode}
          <div
            class="absolute -top-2 z-[-1] h-36 w-36 rounded-full bg-white/10" />
        {/if}
        <IconButton
          disabled={tutorialMode}
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
        class="relative flex flex-col items-center {tutorialMode
          ? '!pointer-events-none opacity-0'
          : 'pointer-events-auto'}">
        <IconButton
          disabled={coinsBet == 100}
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
          disabled={betPlaced !== false || tempPlacedBet !== false}
          on:click|stopPropagation={toggleBet}
          class="relative h-20 w-20 select-none">
          <BetCoinIcon class="h-20" />
          <div
            class="absolute inset-0 flex select-none items-center justify-center">
            {#if loading}
              <LoadingIcon class="h-8 w-8 animate-spin" />
            {:else}
              <span
                style="text-shadow: 3px 3px 0 #EA9C00;"
                class="select-none text-3xl font-extrabold text-[#FFCC00]">
                {coinsBet}
              </span>
            {/if}
          </div>
        </button>
        <IconButton
          on:click={(e) => {
            e.stopImmediatePropagation()
            decreaseBet()
          }}
          disabled={coinsBet == 10}
          class={c('z-[10] flex items-center p-4 disabled:opacity-50', {
            invisible: betPlaced || tempPlacedBet,
          })}>
          <ChevronUpIcon class="h-2 rotate-180" />
        </IconButton>
      </div>
      <div
        class="pointer-events-auto relative flex flex-col items-center space-y-1">
        {#if tutorialMode}
          <div
            class="absolute -top-2 z-[-1] h-36 w-36 rounded-full bg-white/10" />
        {/if}
        <IconButton
          disabled={tutorialMode}
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
      {#if slotsFull}
        <div
          class="absolute bottom-16 -translate-x-3 rounded-md bg-white p-4 text-center text-sm text-black drop-shadow-md">
          Slots are full. Please try again in the <br />
          next slot after 16:32
        </div>
      {/if}
      {#if error}
        <div
          class="absolute bottom-16 -translate-x-3 rounded-md bg-white p-4 text-center text-sm text-black drop-shadow-md">
          {error}
        </div>
      {/if}
    </div>
  {:else}
    <div transition:fade class="flex h-full items-center space-x-4 px-4">
      <div
        class={c('flex items-center', {
          'translate-y-4 -space-y-8 -space-x-8': betResult !== 'pending',
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
            {coinsBet}
          </span>
        </div>
      </div>
      {#if betResult === 'pending'}
        <div class="flex flex-col space-y-1">
          <div class="text-sm">
            You have placed bet on {betPlaced === 'hot' ? 'Hot' : 'Not'} for 10 coins.
            Your bet details:
          </div>
          <div class="flex items-center space-x-2">
            <div
              class="flex items-center space-x-1 rounded-full bg-black/50 py-2 px-3">
              <TimerIcon class="h-4" />
              <span class=" text-sm text-white">10:57</span>
            </div>
            <div
              class="flex items-center space-x-1 rounded-full bg-black/50 py-2 px-3">
              <UserAvatarIcon class="h-4" />
              <span class=" text-sm text-white">11/20</span>
            </div>
          </div>
        </div>
      {:else}
        <div
          class="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border text-xs capitalize">
          {betResult} Icon
        </div>
        <div class="flex flex-col space-y-1">
          <div class="text-sm">
            You placed bet on {betPlaced === 'hot' ? 'Hot' : 'Not'} for 10 coins.
            Bet result:
          </div>
          <div class="flex items-center space-x-2">
            <div
              class="flex items-center space-x-1 rounded-full bg-black/50 py-2 px-3">
              <div class="h-4 w-4 rounded-full border" />
              <span class=" text-sm text-white">10</span>
            </div>
            <div
              class="flex items-center space-x-1 rounded-full bg-black/50 py-2 px-3">
              <WalletIcon class="h-4" />
              <span class=" text-sm text-white">
                {betResult !== 'won' ? '-10' : '20'}
              </span>
            </div>
          </div>
        </div>
      {/if}
    </div>
  {/if}
</hot-or-not>
