<script lang="ts">
import Avatar from '$components/avatar/Avatar.svelte'
import Icon from '$components/icon/Icon.svelte'
import type { VoteRecordWithId } from '$components/up-down/UpDownVote.svelte'
import { getThumbnailUrl } from '$lib/utils/cloudflare'
import { getMsLeftForResult, getVoteEndTime } from '$lib/utils/countdown'
import { pluralize } from '$lib/utils/pluralize'
import userProfile from '$stores/userProfile'

export let vote: VoteRecordWithId

const timeLeft = getMsLeftForResult(new Date(vote.result_at))
</script>

<a
  href="/up-down/votes/{vote.id}"
  data-sveltekit-preload-code="eager"
  class="relative aspect-[3/5] w-full cursor-pointer overflow-hidden rounded-md bg-cover">
  <div
    class="absolute inset-0 scale-110 bg-cover bg-center"
    style="background-image: url('{getThumbnailUrl(vote.videoUid)}')" />
  <div
    style="background: linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.6) 100%);"
    class="pointer-events-none absolute inset-0 z-[2] flex flex-col justify-between p-2 md:p-4">
    <div class="flex items-center space-x-2">
      <Avatar class="h-6 w-6" src={$userProfile.photoUrl} />
      <div class="text-xs font-semibold sm:text-sm">
        {$userProfile.name}
      </div>
    </div>
    <div class="flex flex-col">
      <div class="flex items-center justify-between">
        <div class="flex flex-col">
          <span class="text-xs font-medium uppercase">YOUR VOTE</span>
          <span class="pb-2 text-sm font-bold md:text-lg">
            {vote.voteAmount}
            {pluralize('Token', vote.voteAmount)}
          </span>
        </div>
        <div
          class="relative pb-2 text-4xl font-bold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
          {Math.round(vote.currentScore)}
          <div
            class="absolute -left-3 top-0 mb-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full
            {vote.voteDirection === 'down' ? 'bg-red-500' : 'bg-green-500'}">
            <Icon
              name="arrow-up"
              class="h-4 w-4 
              {vote.voteDirection === 'down' ? 'rotate-180' : ''}" />
          </div>
        </div>
      </div>
      {#if vote.status === 'final'}
        <div
          class="flex w-full items-center justify-center space-x-1 rounded-full py-2 text-xs font-bold text-white md:py-2
          {vote.result?.status === 'won' ? 'bg-green-500' : 'bg-red-500'}">
          {#if vote.result?.status === 'won'}
            You won {vote.result?.won_amount
              ? `${vote.result.won_amount} tokens`
              : ''}
          {:else}
            You lost
          {/if}
        </div>
      {:else if $timeLeft}
        <div
          class="flex w-full items-center justify-center space-x-1 rounded-full bg-orange-500 py-1 text-sm text-white md:py-2">
          <Icon name="stopwatch" class="h-5 w-5" />
          <span class:loading={$timeLeft === '...'}>{$timeLeft}</span>
        </div>
      {/if}
    </div>
  </div>
</a>
