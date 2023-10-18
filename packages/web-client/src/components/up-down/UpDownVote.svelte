<script lang="ts">
import UpDownVoteControls from './UpDownVoteControls.svelte'
import UpDownVoteOutcome from './UpDownVoteOutcome.svelte'

export let votePlaced = false
</script>

<up-down class="pointer-events-none block h-full w-full">
  {#if votePlaced === false}
    <UpDownVoteControls />
  {:else}
    <UpDownVoteOutcome />
  {/if}
</up-down>
