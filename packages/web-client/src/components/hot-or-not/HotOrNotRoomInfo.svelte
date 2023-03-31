<script lang="ts" context="module">
import type {
  BettingStatus,
  SystemTime,
} from '$canisters/individual_user_template/individual_user_template.did'

type UnionValueOf<U> = U extends U ? U[keyof U] : never
type BetStatus = UnionValueOf<BettingStatus>

const systemTime: SystemTime = {
  nanos_since_epoch: 0,
  secs_since_epoch: BigInt(1),
}
</script>

<script lang="ts">
import PieChartIcon from '$components/icons/PieChartIcon.svelte'
import TimerIcon from '$components/icons/TimerIcon.svelte'
import UsersIcon from '$components/icons/UsersIcon.svelte'
import { getMsLeftForBetResult } from '$lib/utils/timeLeft'

export let bettingStatus: BettingStatus
$: betStatus = bettingStatus[0] as BetStatus

$: bettingOpen = !!betStatus
$: usersInThisSlot = betStatus?.number_of_participants || 0
$: onGoingSlot = betStatus?.ongoing_slot || 1
$: betStartedAt = betStatus?.started_at || systemTime

$: timeLeft = getMsLeftForBetResult(onGoingSlot, betStartedAt)
</script>

{#if bettingOpen}
  <div class="flex items-center space-x-3">
    <div
      class="flex items-center space-x-2 rounded-full bg-black/40 px-3 py-2 text-white">
      <TimerIcon class="h-4 w-4" />
      <span class="text-sm">{$timeLeft}</span>
    </div>
    <div
      class="flex items-center space-x-2 rounded-full bg-black/40 px-3 py-2 text-white">
      <UsersIcon class="h-4 w-4" />
      <span class="text-sm">{usersInThisSlot}/100</span>
    </div>
    <div
      class="flex items-center space-x-2 rounded-full bg-black/40 px-3 py-2 text-white">
      <PieChartIcon class="h-4 w-4" />
      <span class="text-sm">{onGoingSlot}/48</span>
    </div>
  </div>
{/if}
