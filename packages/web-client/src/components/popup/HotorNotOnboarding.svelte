<script lang="ts">
import { fade } from 'svelte/transition'
import { showOnboarding } from '$stores/hotOrNotOnboarding'
import left from '$assets/decore-left.png'
import right from '$assets/decore-right.png'
import StarsIcon from '$components/icons/StarsIcon.svelte'
import Button from '$components/button/Button.svelte'
import HotOrNot from '$components/navigation/HotOrNot.svelte'
import TutorialArrow from '$components/icons/TutorialArrow.svelte'
import CoinBagIcon from '$components/icons/CoinBagIcon.svelte'
import GiftBoxIcon from '$components/icons/GiftBoxIcon.svelte'

let step: 1 | 2 | 3 = 1
</script>

{#if $showOnboarding}
  <onboarding
    class="absolute inset-0 z-[15] flex  h-full w-full items-center justify-center bg-black/90 px-8 text-white"
    out:fade|local={{ duration: 500 }}>
    {#if step == 1}
      <div
        class="flex h-full w-full max-w-md flex-col items-center justify-center space-y-32">
        <div
          class="pointer-events-none absolute top-0 flex w-full justify-between">
          <img alt="decore" src={left} class="select-none" />
          <img alt="decore" src={right} class="select-none" />
        </div>
        <div class="relative select-none text-center text-3xl font-bold ">
          <StarsIcon class="absolute -left-10 -top-12 h-24" />
          A new experience
          <br />
          awaits you
        </div>
        <div class="flex w-full flex-col space-y-6">
          <Button on:click={() => (step = 2)}>Start Tutorial</Button>
          <button
            on:click={() => ($showOnboarding = false)}
            class="font-medium">
            Maybe Later
          </button>
        </div>
      </div>
    {:else if step == 2}
      <div
        class="flex h-full w-full max-w-md flex-col items-center justify-center space-y-8">
        <div
          class="relative flex w-full flex-col items-center justify-center space-y-6 text-center">
          <div class="text-3xl font-bold">Place your first bet</div>
          <div>
            Lorem ipsum dolor sit amet, consectetur elit. sed do eiusmod Lorem
            ipsum dolor sit amet consectetur elit, sed do eiusmod.
          </div>
          <div class="absolute top-32 left-10">
            <TutorialArrow class="h-64" />
          </div>
          <div style="transform: scaleX(-1);" class="absolute top-32 right-14">
            <TutorialArrow class="h-60" />
          </div>
        </div>
        <Button class="px-12" on:click={() => (step = 3)}>Next</Button>
        <button on:click={() => ($showOnboarding = false)} class="font-medium">
          Skip
        </button>

        <div
          class="pointer-events-none absolute inset-x-0 bottom-0 z-[5] max-h-48">
          <HotOrNot tutorialMode />
        </div>
      </div>
    {:else if step == 3}
      <div
        class="flex h-full w-full max-w-md flex-col items-center justify-center space-y-16">
        <div class="text-3xl font-bold">Place your first bet</div>
        <div class="flex flex-col items-center space-y-3">
          <CoinBagIcon class="h-12 w-12" />
          <span>You can buy coins</span>
        </div>
        <div class="flex flex-col items-center space-y-3">
          <GiftBoxIcon outlined class="h-12 w-12" />
          <span>Win lots of prizes</span>
        </div>
        <Button on:click={() => ($showOnboarding = false)} class="w-full">
          Let's make some money
        </Button>
      </div>
    {/if}
  </onboarding>
{/if}
