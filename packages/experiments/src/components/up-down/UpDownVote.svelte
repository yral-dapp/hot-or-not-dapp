<script lang="ts" context="module">
export type UpDownVoteDetails = {
  direction: 'up' | 'down'
  coins: number
}
</script>

<script lang="ts">
import UpDownVoteControls from './UpDownVoteControls.svelte'
import UpDownVoteOutcome from './UpDownVoteOutcome.svelte'

export let voteDetails: UpDownVoteDetails | undefined = undefined
</script>

<up-down class="pointer-events-none block h-full w-full">
  {#if voteDetails}
    <UpDownVoteOutcome {voteDetails} />
  {:else}
    <UpDownVoteControls
      on:votePlaced={({ detail }) => (voteDetails = detail)} />
  {/if}
</up-down>
