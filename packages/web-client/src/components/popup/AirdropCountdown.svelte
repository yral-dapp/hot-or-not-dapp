<script lang="ts">
import { getTimeLeft } from '$lib/utils/timeLeft'

// const airdropEndDate = new Date('31 May 11:59:59 PM 2023')
const airdropEndDate = new Date('23 May 12:00:00 PM 2023')
$: time = getTimeLeft(new Date(), airdropEndDate)
$: countdownOver =
  $time.days === 0 &&
  $time.minutes === 0 &&
  $time.seconds === 0 &&
  $time.hours === 0
</script>

{#if !countdownOver}
  <div class="flex items-center gap-4">
    <div class="flex flex-col items-center gap-1">
      <div
        class="flex h-12 w-12 items-center justify-center rounded-md border-[1px] border-white text-2xl font-bold text-primary">
        {$time.days.toString().padStart(2, '0')}
      </div>
      <span class="text-xs">Days</span>
    </div>
    <div class="flex flex-col items-center gap-1">
      <div
        class="flex h-12 w-12 items-center justify-center rounded-md border-[1px] border-white text-2xl font-bold text-primary">
        {$time.hours.toString().padStart(2, '0')}
      </div>
      <span class="text-xs">Hours</span>
    </div>
    <div class="flex flex-col items-center gap-1">
      <div
        class="flex h-12 w-12 items-center justify-center rounded-md border-[1px] border-white text-2xl font-bold text-primary">
        {$time.minutes.toString().padStart(2, '0')}
      </div>
      <span class="text-xs">Minutes</span>
    </div>
    <div class="flex flex-col items-center gap-1">
      <div
        class="flex h-12 w-12 items-center justify-center rounded-md border-[1px] border-white text-2xl font-bold text-primary">
        {$time.seconds.toString().padStart(2, '0')}
      </div>
      <span class="text-xs">Seconds</span>
    </div>
  </div>
{/if}
