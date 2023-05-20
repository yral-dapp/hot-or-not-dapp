<script lang="ts">
import AirdropCompleteGraphics from '$components/icons/AirdropCompleteGraphics.svelte'
import DiscordIcon from '$components/icons/DiscordIcon.svelte'
import TelegramIcon from '$components/icons/TelegramIcon.svelte'
import TwitterIcon from '$components/icons/TwitterIcon.svelte'
import AirdropCountdown from '$components/popup/AirdropCountdown.svelte'

export let adjustTopMargin = false
</script>

<div
  class="max-w-80 h-max max-h-80 w-max px-32 md:px-24
  {adjustTopMargin ? '-mt-40' : '-mt-12'}">
  <AirdropCompleteGraphics class="h-full w-full" />
</div>
<div
  class="flex w-full max-w-md flex-col items-center justify-center space-y-2 px-8 md:space-y-4 md:px-16
  {adjustTopMargin ? 'pt-24' : 'pt-4'}">
  <div class="text-3xl font-bold uppercase text-transparent text-white">
    Congratulations
  </div>
  <div class="md:text-md py-4 text-center text-sm">
    We have registered your interest. Airdrop will be live on 23 May
  </div>

  <div class="py-2 md:py-4">
    <AirdropCountdown />
  </div>

  <a
    on:click
    href="/airdrop-guide"
    class="text-center text-sm text-primary underline">
    Learn more about the airdrop here
  </a>
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
