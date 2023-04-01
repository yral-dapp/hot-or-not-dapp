<script lang="ts" context="module">
import type {
  BetOutcomeForBetMaker,
  PlacedBetDetail,
} from '$canisters/individual_user_template/individual_user_template.did'

const betKeyword: Record<OutcomeStatus, string> = {
  Lost: 'lost',
  Draw: 'lost',
  AwaitingResult: 'bet',
  Won: 'received',
}

type UnionKeyOf<U> = U extends U ? keyof U : never
type OutcomeStatus = UnionKeyOf<BetOutcomeForBetMaker>

function getBetOutcome(betDetails: PlacedBetDetail): OutcomeStatus {
  return Object.keys(betDetails.outcome_received)[0] as OutcomeStatus
}
</script>

<script lang="ts">
import Avatar from '$components/avatar/Avatar.svelte'
import TimerIcon from '$components/icons/TimerIcon.svelte'
import type { PostPopulatedWithBetDetails } from '$lib/helpers/profile'
import { getThumbnailUrl } from '$lib/utils/cloudflare'
import getDefaultImageUrl from '$lib/utils/getDefaultImageUrl'
import { generateRandomName } from '$lib/utils/randomUsername'
import { getMsLeftForBetResult, getTimeStringFromMs } from '$lib/utils/timeLeft'
import c from 'clsx'

export let me: boolean
export let userId: string
export let post: PostPopulatedWithBetDetails

$: YOU = me ? 'You' : ''
$: BET_OUTCOME = getBetOutcome(post.placed_bet_details)
$: BET_KEYWORD = betKeyword[BET_OUTCOME]
$: avatarUrl =
  post.created_by_profile_photo_url[0] ||
  getDefaultImageUrl(post.created_by_user_principal_id)
$: imageBg = getThumbnailUrl(post.video_uid)
$: username =
  post.created_by_unique_user_name[0] ||
  generateRandomName('name', post.created_by_user_principal_id)
$: timeLeft = getMsLeftForBetResult(
  post.placed_bet_details.slot_id,
  post.created_at,
)
$: outcomeAmount =
  Number(Object.values(post.placed_bet_details.outcome_received || {})?.[0]) ||
  0
</script>

<a
  href={`/profile/${userId}/speculations/${post.publisher_canister_id}@${post.id}`}
  data-sveltekit-preload-code="eager"
  class="relative aspect-[3/4] w-full cursor-pointer overflow-hidden rounded-md bg-cover">
  <div
    class="absolute inset-0 scale-110 bg-cover bg-center"
    style="background-image: url('{imageBg}')" />
  <div
    style="background: linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.6) 100%);"
    class="pointer-events-none absolute inset-0 z-[2] flex flex-col justify-between p-2 md:p-4">
    <div class="flex items-center space-x-2">
      <Avatar class="h-6 w-6" src={avatarUrl} />
      <div class="text-sm font-semibold">
        {username}
      </div>
    </div>
    <div class="flex flex-col">
      <span class="text-xs font-thin uppercase">
        {YOU}
        {BET_KEYWORD}
      </span>
      <span class="pb-2 text-lg font-bold">
        {#if BET_OUTCOME === 'Draw'}
          {Number(post.placed_bet_details.amount_bet) - outcomeAmount}
        {:else}
          {outcomeAmount}
        {/if}
        Tokens
      </span>

      {#if BET_OUTCOME !== 'AwaitingResult'}
        <div
          class={c(
            'flex w-full items-center justify-center rounded-full  py-2 text-sm text-white',
            {
              'bg-red-600': BET_OUTCOME === 'Lost',
              'bg-green-500': BET_OUTCOME === 'Won',
              'bg-gray-600': BET_OUTCOME === 'Draw',
            },
          )}>
          {BET_OUTCOME !== 'Draw' ? YOU : ''}
          {BET_OUTCOME}
        </div>
      {:else if BET_OUTCOME === 'AwaitingResult'}
        <div
          class="flex w-full items-center justify-center space-x-1 rounded-full bg-orange-500 py-2 text-sm text-white">
          <TimerIcon class="h-4 w-4" />
          <span>{$timeLeft}</span>
        </div>
      {/if}
    </div>
  </div>
</a>
