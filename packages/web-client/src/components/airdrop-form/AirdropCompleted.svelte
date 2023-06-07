<script lang="ts">
import { goto } from '$app/navigation'
import Avatar from '$components/avatar/Avatar.svelte'
import Button from '$components/button/Button.svelte'
import DiscordIcon from '$components/icons/DiscordIcon.svelte'
import TelegramIcon from '$components/icons/TelegramIcon.svelte'
import TwitterIcon from '$components/icons/TwitterIcon.svelte'
import { isEnrolledDscvr, topThreeEntry } from '$lib/helpers/airdrop'
import { individualUser } from '$lib/helpers/backend'
import { sanitizeProfile } from '$lib/helpers/profile'
import { getShortNumber } from '$lib/utils/shortNumber'
import { authState } from '$stores/auth'
import { loadingAuthStatus } from '$stores/loading'
import type { UserProfile } from '$stores/userProfile'
import { onMount } from 'svelte'

type User = {
  canisterId: string
  principalId: string
  walletBalance: number
}

export let gotoHotOrNot = false

let enrolledInDscvr = true
let users:
  | {
      profile: UserProfile
      data: User
    }[]
  | null = null

$: authorized = $authState.isLoggedIn && !$loadingAuthStatus
$: authorized && checkIfEnrolledinDscvr()

async function fetchUsers(data: User[]) {
  if (data?.length) {
    data.sort((a, b) => b.walletBalance - a.walletBalance)
    const d = await Promise.all(
      data.map((d) =>
        individualUser(d.canisterId)
          .get_profile_details()
          .then((u) => {
            return {
              profile: sanitizeProfile(u, d.principalId),
              data: d,
            }
          }),
      ),
    )
    users = d
  }
}

async function checkIfEnrolledinDscvr() {
  if ($authState.idString) {
    enrolledInDscvr = await isEnrolledDscvr($authState.idString)
  }
}

onMount(async () => {
  const d = await topThreeEntry()
  if (d.success && d.data) {
    fetchUsers(d.data as any)
  }
})
</script>

<div
  class="flex w-full max-w-md flex-col items-center justify-center space-y-2 px-8 pb-16 pt-4 md:space-y-4
  md:px-16">
  <div class="text-3xl font-bold uppercase text-transparent text-white">
    Congratulations
  </div>
  <div class="md:text-md py-4 text-center text-sm">
    You profile has been registered for the airdrop
  </div>
  {#if users}
    <div class="flex w-screen justify-center gap-5">
      {#if users[1]}
        <div class="flex w-[5.5rem] shrink-0 flex-col items-center pt-8">
          <span class="text-xs font-bold">2</span>
          <Avatar
            src={users[1].profile.profile_picture_url}
            class="my-2 h-16 w-16" />
          <span class="text-center text-sm font-bold text-primary">
            {getShortNumber(users[1].data.walletBalance)} COYNS
          </span>
          <span class="text-center text-xs font-bold">
            @{users[1].profile.unique_user_name}
          </span>
        </div>
      {/if}
      {#if users[0]}
        <div class="flex w-24 shrink-0 flex-col items-center">
          <span class="text-xs font-bold">1</span>
          <Avatar
            src={users[0].profile.profile_picture_url}
            class="my-2 h-20 w-20" />
          <span class="text-center text-sm font-bold text-primary">
            {getShortNumber(users[0].data.walletBalance)} COYNS
          </span>
          <span class="text-center text-xs font-bold">
            @{users[0].profile.unique_user_name}
          </span>
        </div>
      {/if}
      {#if users[2]}
        <div class="flex w-[5.5rem] shrink-0 flex-col items-center pt-8">
          <span class="text-xs font-bold">3</span>
          <Avatar
            src={users[2].profile.profile_picture_url}
            class="my-2 h-16 w-16" />
          <span class="text-center text-sm font-bold text-primary">
            {getShortNumber(users[2].data.walletBalance)} COYNS
          </span>
          <span class="text-center text-xs font-bold">
            @{users[2].profile.unique_user_name}
          </span>
        </div>
      {/if}
    </div>
  {/if}
  <div class="py-4 text-center text-sm">
    These were our top earners from yesterday. Play Hot or Not to earn COYNs*,
    feature on the leaderboard and boost your HOT token airdrop
  </div>

  <div class="w-full px-4 py-4">
    <Button
      on:click
      on:click={() => gotoHotOrNot && goto('/hotornot')}
      class="w-full px-8"
      type="primary">
      Play to Earn
    </Button>
  </div>
  {#if !enrolledInDscvr}
    <a
      on:click
      href="/airdrop-dscvr"
      class="pb-2 text-center text-sm font-bold text-white">
      Submit your DSCVR ID for a boost
    </a>
  {/if}
  <a
    on:click
    href="/airdrop-guide"
    class="text-center text-sm text-primary underline">
    Learn more about the rewards here
  </a>
  <div class="py-4 text-sm text-white/50">
    * Coyns earned in-app are different compared to airdrop tokens
  </div>
  <div class="flex flex-col items-center justify-center space-y-4 px-8">
    <div class="flex items-center space-x-4">
      <a
        href="https://t.me/+c-LTX0Cp-ENmMzI1"
        target="_blank"
        class="flex h-12 w-12 items-center justify-center rounded-full border-[1px] border-primary transition-colors duration-200 active:bg-primary">
        <TelegramIcon class="h-5 w-5 -translate-x-[1px]" />
      </a>
      <a
        href="https://discord.gg/GZ9QemnZuj"
        target="_blank"
        class="flex h-12 w-12 items-center justify-center rounded-full border-[1px] border-primary transition-colors duration-200 active:bg-primary">
        <DiscordIcon class="h-5 w-5" />
      </a>
      <a
        href="https://twitter.com/hotornot_dapp"
        target="_blank"
        class="flex h-12 w-12 items-center justify-center rounded-full border-[1px] border-primary transition-colors duration-200 active:bg-primary">
        <TwitterIcon class="h-4 w-4" />
      </a>
    </div>
    <div class="text-center text-sm text-white/70">
      For more queries, you can get in touch with us on our socials
    </div>
  </div>
</div>
