<script lang="ts">
import Avatar from '$components/avatar/Avatar.svelte'
import Icon from '$components/icon/Icon.svelte'
import type { VoteRecord } from '$lib/db/db.types'
import { getThumbnailUrl } from '$lib/utils/cloudflare'
import { getMsLeftForResult, getVoteEndTime } from '$lib/utils/countdown'
import { pluralize } from '$lib/utils/pluralize'
import userProfile from '$stores/userProfile'

export let vote: VoteRecord

const timeLeft = getMsLeftForResult(
  getVoteEndTime(new Date(vote.result_at), new Date()),
)
</script>

<a
  href="/up-down/votes/{vote.videoUoid}@{vote.videoOid}"
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
          class="mb-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full
          {vote.voteDirection === 'up' ? 'bg-green-500' : 'bg-red-500'}">
          <Icon
            name="arrow-up"
            class="h-5 w-5  {vote.voteDirection === 'down'
              ? 'rotate-180'
              : ''}" />
        </div>
      </div>
      {#if $timeLeft}
        <div
          class="flex w-full items-center justify-center space-x-1 rounded-full bg-orange-500 py-1 text-sm text-white md:py-2">
          <Icon name="stopwatch" class="h-5 w-5" />
          <span>{$timeLeft}</span>
        </div>
      {/if}
    </div>
  </div>
</a>
