<script lang="ts">
import { getTimeLeft } from '$lib/utils/timeLeft'

const airdropEndDate = new Date(1689422400000) // "15 July 2023 12:00 PM UTC"

$: time = getTimeLeft(new Date(), airdropEndDate)
$: countdownOver =
  $time.days === 0 &&
  $time.minutes === 0 &&
  $time.seconds === 0 &&
  $time.hours === 0
</script>

{#if !countdownOver}
  <div class="flex select-none items-center divide-x-[1px] divide-primary">
    <div class="flex flex-col items-center gap-1">
      <div
        class="flex w-20 items-center justify-center rounded-md text-3xl font-bold text-white">
        {$time.days.toString().padStart(2, '0')}
      </div>
      <span class="text-xs">Days</span>
    </div>
    <div class="flex flex-col items-center gap-1">
      <div
        class="flex w-20 items-center justify-center rounded-md text-3xl font-bold text-white">
        {$time.hours.toString().padStart(2, '0')}
      </div>
      <span class="text-xs">Hours</span>
    </div>
    <div class="flex flex-col items-center gap-1">
      <div
        class="flex w-20 items-center justify-center rounded-md text-3xl font-bold text-white">
        {$time.minutes.toString().padStart(2, '0')}
      </div>
      <span class="text-xs">Minutes</span>
    </div>
    <div class="flex flex-col items-center gap-1">
      <div
        class="flex w-20 items-center justify-center rounded-md text-3xl font-bold text-white">
        {$time.seconds.toString().padStart(2, '0')}
      </div>
      <span class="text-xs">Seconds</span>
    </div>
  </div>
{/if}
