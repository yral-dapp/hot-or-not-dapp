<script lang="ts">
import { navigateBack } from '$lib/stores/navigation'
import goBack from '$lib/utils/goBack'
import IconButton from '@hnn/components/button/IconButton.svelte'
import Icon from '@hnn/components/icon/Icon.svelte'
import HomeLayout from '@hnn/components/web-client/layout/HomeLayout.svelte'
import coinsBg from './coinsBg.webp'

let loading = false
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="true" />
  <link
    href="https://fonts.googleapis.com/css2?family=Gloria+Hallelujah&display=swap"
    rel="stylesheet" />
  <title>Migrate to Yral | Hot or Not</title>
</svelte:head>

<HomeLayout>
  <svelte:fragment slot="top">
    <div
      class="flex w-full items-center justify-center bg-black py-4 shadow-xl shadow-black/50">
      Migrate to YRAL
      <div class="absolute left-4 top-4">
        <IconButton
          iconName="caret-left"
          iconClass="h-7 w-7"
          on:click={() => goBack($navigateBack || '/menu', true)}
          class="shrink-0" />
      </div>
    </div>
  </svelte:fragment>
  <div class="h-full w-full overflow-y-auto" slot="content">
    {#if loading}
      <div class="flex h-full w-full items-center justify-center">
        <Icon name="loading" class="h-8 w-8 animate-spin-slow" />
      </div>
    {:else}
      <div
        class="flex h-full w-full flex-col items-center gap-10 overflow-y-auto py-8">
        <div class="relative mt-28 flex w-full flex-col items-center gap-2">
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
    {/if}
  </div>
</HomeLayout>

<style>
.gloria-hallelujah-regular {
  font-family: 'Gloria Hallelujah', cursive;
  font-weight: 400;
  font-style: normal;
}
</style>
