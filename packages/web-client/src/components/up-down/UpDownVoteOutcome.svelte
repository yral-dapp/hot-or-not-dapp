<script lang="ts">
import Icon from '$components/icon/Icon.svelte'
import { getTimeStringFromMs } from '$lib/utils/timeLeft'
import type { UpDownVoteDetails } from './UpDownVote.svelte'
import { readable, type Readable } from 'svelte/store'

export let voteDetails: UpDownVoteDetails
let timeLeft: Readable<string>

function getMsLeftForBetResult(betEndTime: Date) {
  const now = new Date()
  let diff = betEndTime.getTime() - now.getTime()

  if (diff > 0) {
    const dt = getTimeStringFromMs(diff)
    const initialValue =
      dt.minutes + ':' + (dt.seconds < 10 ? '0' : '') + dt.seconds

    return readable(initialValue, (set) => {
      let counter = 1
      const updateMs = () => {
        if (diff - counter * 1000 > 0) {
          const { minutes, seconds } = getTimeStringFromMs(
            diff - counter * 1000,
          )
          set(minutes + ':' + (seconds < 10 ? '0' : '') + seconds)
        } else {
          counter = 1
          diff = 36_00_000
        }
      }

      const interval = setInterval(() => {
        updateMs()
        counter++
      }, 1000)

      return () => {
        clearInterval(interval)
      }
    })
  } else {
    return readable('')
  }
}

const fourtyMinutes = new Date()
fourtyMinutes.setMinutes(fourtyMinutes.getMinutes() + 40)

timeLeft = getMsLeftForBetResult(fourtyMinutes)
</script>

<div
  class="pointer-events-auto flex items-center justify-center gap-4 px-4 pt-10">
  <div
    class="flex w-24 flex-col items-center justify-center gap-1 rounded-md py-4
    {voteDetails.direction === 'up' ? 'bg-green-500' : 'bg-red-500'}">
    <div
      class="flex h-5 w-5 items-center justify-center rounded-full bg-white
      {voteDetails.direction === 'up' ? 'text-green-500' : 'text-red-500'}">
      <Icon name="arrow-up" class="h-5 w-5 rotate-180" />
    </div>
    <div class="text-sm capitalize">{voteDetails.direction}</div>
  </div>
  <div class="relative h-20 w-20 select-none">
    <Icon name="coin-face" class="h-20 w-20" />
    <div class="absolute inset-0 flex select-none items-center justify-center">
      <span
        style="text-shadow: 3px 3px 0 #EA9C00;"
        class="select-none text-3xl font-extrabold text-[#FFCC00]">
        {voteDetails.coins}
      </span>
    </div>
  </div>
  {#if $timeLeft}
    <div class="flex grow flex-col items-center justify-center gap-1">
      <div
        class="flex w-full items-center justify-center space-x-2 rounded-full bg-primary px-3 py-2 shadow-button-primary">
        <Icon name="stopwatch" class="h-5 w-5" />
        <span class="font-bold text-white">{$timeLeft}</span>
      </div>
      <div class="text-xs text-white">Your vote has been placed</div>
    </div>
  {/if}
</div>
