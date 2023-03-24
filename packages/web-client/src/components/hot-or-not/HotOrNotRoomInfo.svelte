<script lang="ts">
import PieChartIcon from '$components/icons/PieChartIcon.svelte'
import TimerIcon from '$components/icons/TimerIcon.svelte'
import UsersIcon from '$components/icons/UsersIcon.svelte'
$: timeLeft = '50m 11s'
$: usersInThisSlot = 48
$: roomNumber = 24
</script>

<div class="flex items-center space-x-3">
  <div
    class="flex items-center space-x-2 rounded-full bg-black/40 py-2 px-3 text-white">
    <TimerIcon class="h-4 w-4" />
    <span class="text-sm">{timeLeft}</span>
  </div>
  <div
    class="flex items-center space-x-2 rounded-full bg-black/40 py-2 px-3 text-white">
    <UsersIcon class="h-4 w-4" />
    <span class="text-sm">{usersInThisSlot}/100</span>
  </div>
  <div
    class="flex items-center space-x-2 rounded-full bg-black/40 py-2 px-3 text-white">
    <PieChartIcon class="h-4 w-4" />
    <span class="text-sm">{roomNumber}/48</span>
  </div>
</div>
