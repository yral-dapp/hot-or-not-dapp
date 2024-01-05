<script lang="ts">
import { fade } from 'svelte/transition'
import { showOnboardingPopup } from '$lib/stores/popups'
import left from '$lib/assets/decore-left.png'
import right from '$lib/assets/decore-right.png'
import HotOrNotVote from '$lib/components/voting/HotOrNotVote.svelte'
import Button from '@hnn/components/button/Button.svelte'
import Icon from '@hnn/components/icon/Icon.svelte'

let step: 1 | 2 | 3 | 4 = 1
</script>

{#if $showOnboardingPopup}
  <onboarding
    class="absolute inset-0 z-[15] flex h-full w-full items-center justify-center bg-black/90 px-8 text-white"
    out:fade={{ duration: 500 }}>
    {#if step == 1}
      <div
        class="flex h-full w-full max-w-md flex-col items-center justify-center space-y-32">
        <div
          class="pointer-events-none absolute top-0 flex w-full justify-between">
          <img alt="decore" src={left} class="select-none" />
          <img alt="decore" src={right} class="select-none" />
        </div>
        <div class="relative w-full select-none text-center text-3xl font-bold">
          <div
            class="absolute inset-0 bottom-16 flex items-center justify-center">
            <Icon name="stars-graphics" class="h-36" />
          </div>
          Welcome to
          <br />
          HotorNot!
        </div>
        <div class="flex w-full flex-col space-y-6">
          <Button on:click={() => (step = 2)}>Start Tutorial</Button>
          <button
            on:click={() => ($showOnboardingPopup = false)}
            class="font-medium">
            Maybe Later
          </button>
        </div>
      </div>
    {:else if step == 2}
      <div
        class="relative flex h-full w-full max-w-md flex-col items-center justify-center space-y-8">
        <div
          class="flex w-full flex-col items-center justify-center space-y-6 text-center">
          <div class="text-3xl font-bold">Choose your voting amount</div>
          <div>
            Select your voting amount by clicking on the token between 10, 50,
            or 100 tokens.
          </div>
        </div>
        <div class="absolute bottom-32 -translate-x-full">
          <Icon name="arrow-long-down" class="h-48 w-8" />
        </div>
        <Button class="px-12" on:click={() => (step = 3)}>Next</Button>
        <button
          on:click={() => ($showOnboardingPopup = false)}
          class="font-medium">
          Skip
        </button>

        <div
          class="pointer-events-none absolute inset-x-0 bottom-20 z-[5] max-h-48">
          <HotOrNotVote
            tutorialMode={{ highlightCoin: true, highlightSelectors: false }} />
        </div>
      </div>
    {:else if step == 3}
      <div
        class="relative flex h-full w-full max-w-md flex-col items-center justify-center space-y-8">
        <div
          class="flex w-full flex-col items-center justify-center space-y-6 text-center">
          <div class="text-3xl font-bold">Place your vote</div>
          <div>
            Click 'Hot' or 'Not' to predict whether a video will go viral or
            not.
          </div>
        </div>
        <div class="absolute bottom-40 left-3">
          <Icon name="arrow-long-down" class="h-52 w-8" />
        </div>
        <div style="transform: scaleX(-1);" class="absolute bottom-40 right-3">
          <Icon name="arrow-long-down" class="h-56 w-8" />
        </div>
        <Button class="px-12" on:click={() => (step = 4)}>Next</Button>
        <button
          on:click={() => ($showOnboardingPopup = false)}
          class="font-medium">
          Skip
        </button>

        <div
          class="pointer-events-none absolute inset-x-0 bottom-20 z-[5] max-h-48">
          <HotOrNotVote
            tutorialMode={{ highlightCoin: false, highlightSelectors: true }} />
        </div>
      </div>
    {:else if step == 4}
      <div
        class="flex h-full w-full max-w-md flex-col items-center justify-center space-y-16">
        <div class="text-3xl font-bold">Win 2X Coyn tokens</div>
        <div class="flex flex-col items-center space-y-3">
          <Icon name="pouch" class="h-12 w-12" />
          <span>Win 2X Coyn tokens</span>
        </div>
        <div class="flex flex-col items-center space-y-3">
          <Icon name="giftbox" class="h-12 w-12" />
          <span>Vote with the majority and win double the tokens!</span>
        </div>
        <Button on:click={() => ($showOnboardingPopup = false)} class="w-full">
          Let's make some money
        </Button>
      </div>
    {/if}
  </onboarding>
{/if}
