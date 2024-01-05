<script lang="ts" context="module">
import type {
  BettingStatus,
  SystemTime,
} from '@hnn/declarations/individual_user_template/individual_user_template.did'
import Icon from '@hnn/components/icon/Icon.svelte'

type UnionValueOf<U> = U extends U ? U[keyof U] : never
type BetStatus = UnionValueOf<BettingStatus>

const systemTime: SystemTime = {
  nanos_since_epoch: 0,
  secs_since_epoch: BigInt(1),
}
</script>

<script lang="ts">
import Tooltip from '@hnn/components/tooltip/Tooltip.svelte'
import { getMsLeftForBetResult } from '$lib/utils/timeLeft'

export let bettingStatus: BettingStatus

$: bettingStatusValue = Object.values(bettingStatus || {})?.[0] as BetStatus

$: bettingOpen =
  bettingStatusValue !== null &&
  !bettingStatusValue.has_this_user_participated_in_this_post[0]
$: usersInThisSlot = bettingStatusValue?.number_of_participants || 0
$: onGoingSlot = bettingStatusValue?.ongoing_slot || 1
$: startTime = bettingStatusValue?.started_at || systemTime
$: timeLeft = getMsLeftForBetResult(onGoingSlot, startTime)
</script>

{#if bettingOpen}
  <div class="pointer-events-auto flex items-center space-x-3">
    {#if $timeLeft}
      <Tooltip text="Time Remaining for Result" position="middle">
        <div
          class="flex items-center space-x-2 rounded-full bg-black/40 px-3 py-2 text-white">
          <Icon name="stopwatch" class="h-4 w-4" />
          <span class="text-sm">{$timeLeft}</span>
        </div>
      </Tooltip>
    {/if}
    <Tooltip text="Participants" position="middle">
      <div
        class="flex items-center space-x-2 rounded-full bg-black/40 px-3 py-2 text-white">
        <Icon name="user-multiple" class="h-4 w-4" />
        <span class="text-sm">{usersInThisSlot}/100</span>
      </div>
    </Tooltip>
    <Tooltip text="Hours since upload" position="middle">
      <div
        class="flex items-center space-x-2 rounded-full bg-black/40 px-3 py-2 text-white">
        <Icon name="pie-chart" class="h-4 w-4" />
        <span class="text-sm">{onGoingSlot}/48</span>
      </div>
    </Tooltip>
  </div>
{/if}
