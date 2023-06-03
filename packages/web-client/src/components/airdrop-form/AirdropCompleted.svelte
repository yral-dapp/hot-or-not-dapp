<script lang="ts">
import { goto } from '$app/navigation'
import Avatar from '$components/avatar/Avatar.svelte'
import Button from '$components/button/Button.svelte'
import DiscordIcon from '$components/icons/DiscordIcon.svelte'
import TelegramIcon from '$components/icons/TelegramIcon.svelte'
import TwitterIcon from '$components/icons/TwitterIcon.svelte'

export let adjustTopMargin = false
export let gotoHotOrNot = false
</script>

<div
  class="flex w-full max-w-md flex-col items-center justify-center space-y-2 px-8 pb-16 md:space-y-4 md:px-16
  {adjustTopMargin ? 'pt-24' : 'pt-4'}">
  <div class="text-3xl font-bold uppercase text-transparent text-white">
    Congratulations
  </div>
  <div class="md:text-md py-4 text-center text-sm">
    You profile has been registered for the airdrop
  </div>
  <div class="flex gap-5">
    <div class="flex flex-col items-center pt-8">
      <span class="text-xs font-bold">2</span>
      <Avatar
        src="https://sm.ign.com/ign_ap/cover/a/avatar-gen/avatar-generations_hugw.jpg"
        class="my-2 h-16 w-16" />
      <span class="text-sm font-bold text-primary">32.1k COYNS</span>
      <span class="text-xs font-bold">@syyhu</span>
    </div>
    <div class="flex flex-col items-center">
      <span class="text-xs font-bold">1</span>
      <Avatar
        src="https://sm.ign.com/ign_ap/cover/a/avatar-gen/avatar-generations_hugw.jpg"
        class="my-2 h-20 w-20" />
      <span class="text-sm font-bold text-primary">32.1k COYNS</span>
      <span class="text-xs font-bold">@syyhu</span>
    </div>
    <div class="flex flex-col items-center pt-8">
      <span class="text-xs font-bold">3</span>
      <Avatar
        src="https://sm.ign.com/ign_ap/cover/a/avatar-gen/avatar-generations_hugw.jpg"
        class="my-2 h-16 w-16" />
      <span class="text-sm font-bold text-primary">32.1k COYNS</span>
      <span class="text-xs font-bold">@syyhu</span>
    </div>
  </div>
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

  <a
    on:click
    href="/airdrop-dscvr"
    class="pb-2 text-center text-sm font-bold text-white">
    Submit your DSCVR ID for a boost
  </a>
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
