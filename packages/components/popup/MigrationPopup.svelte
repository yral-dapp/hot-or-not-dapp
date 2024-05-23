<script lang="ts">
import coinsBg from './coinsBg.webp'
import IconButton from '../button/IconButton.svelte'
import { fade } from 'svelte/transition'
import Button from '../button/Button.svelte'
import Icon from '../icon/Icon.svelte'
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="true" />
  <link
    href="https://fonts.googleapis.com/css2?family=Gloria+Hallelujah&display=swap"
    rel="stylesheet" />
</svelte:head>

<div
  transition:fade
  class="absolute inset-0 z-[98] flex h-full w-full flex-col items-center justify-start bg-black/100 text-white">
  <div
    class="flex w-full max-w-sm flex-col items-center justify-between space-y-14 px-8">
    <IconButton
      iconName="close"
      iconClass="h-5 w-5 text-black"
      on:click
      class="absolute right-5 top-5 rounded-full bg-white p-1" />
    <div
      class="flex h-full w-full flex-col items-center justify-center gap-10 py-8">
      <div class="relative mt-16 flex w-full flex-col items-center gap-2">
        <div class="absolute inset-0 z-0 flex items-center justify-center">
          <img src={coinsBg} alt="bg" class="w-full max-w-56" />
        </div>
        <div class="text-lg font-semibold">Our new app</div>
        <div class="z-[1]">
          <span class="gloria-hallelujah-regular text-4xl text-[#E2017B]">
            Yral
          </span>
          <span class="pl-1 text-2xl font-bold">is here</span>
        </div>
      </div>
      <div class="pt-12 text-center text-sm">
        We are phasing out HotorNot and moving to YRAL. Transfer your HotorNot
        Account and wallet balance to YRAL before time runs out.
      </div>
      <div class="text-center text-sm font-bold">
        Go to <a
          class="text-[#E2017B] underline"
          target="_blank"
          href="https://yral.com">
          yral.com
        </a>
        and get your yral principal id before you start!
      </div>
      <Button href="/migrate" class="w-full">Transfer your account</Button>
    </div>
    <div class="flex flex-col items-center justify-center space-y-4 px-8">
      <div class="flex items-center space-x-4">
        <a
          href="https://t.me/+c-LTX0Cp-ENmMzI1"
          target="_blank"
          class="flex h-12 w-12 items-center justify-center rounded-full border-[1px] border-primary transition-colors duration-200 active:bg-primary">
          <Icon name="telegram-logo" class="h-5 w-5 -translate-x-[1px]" />
        </a>
        <a
          href="https://discord.gg/GZ9QemnZuj"
          target="_blank"
          class="flex h-12 w-12 items-center justify-center rounded-full border-[1px] border-primary transition-colors duration-200 active:bg-primary">
          <Icon name="discord-logo" class="h-5 w-5" />
        </a>
        <a
          href="https://twitter.com/hotornot_dapp"
          target="_blank"
          class="flex h-12 w-12 items-center justify-center rounded-full border-[1px] border-primary transition-colors duration-200 active:bg-primary">
          <Icon name="twitter-logo" class="h-4 w-4" />
        </a>
      </div>
      <div class="text-center text-sm text-white/70">
        For more queries, you can get in touch with us on our socials
      </div>
    </div>
  </div>
</div>

<style>
.gloria-hallelujah-regular {
  font-family: 'Gloria Hallelujah', cursive;
  font-weight: 400;
  font-style: normal;
}
</style>
