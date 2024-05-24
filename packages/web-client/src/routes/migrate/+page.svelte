<script lang="ts">
import { navigateBack } from '$lib/stores/navigation'
import goBack from '$lib/utils/goBack'
import IconButton from '@hnn/components/button/IconButton.svelte'
import Icon from '@hnn/components/icon/Icon.svelte'
import HomeLayout from '@hnn/components/web-client/layout/HomeLayout.svelte'
import coinsBg from './coins.webp'
import Button from '@hnn/components/button/Button.svelte'
import { authState } from '$lib/stores/auth'

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
        class="mx-auto flex h-full w-full max-w-sm flex-col items-center gap-10 overflow-y-auto px-8 py-8 lg:max-w-lg">
        <div class="relative mt-28 flex w-full flex-col items-center gap-2">
          <div
            class="absolute inset-0 z-0 -mt-10 flex items-center justify-center">
            <img src={coinsBg} alt="bg" class="max-w-84 w-full" />
          </div>
          <div class="z-[1] text-center text-xl font-bold">
            Transfer your HotorNot Account and Wallet Balance to
          </div>
          <a
            target="_blank"
            class="text-3xl font-bold uppercase text-[#E2017B]"
            href="https://yral.com">
            Yral.com
          </a>
        </div>
        <div class="h-1 w-10 border-t border-dashed border-white"></div>
        <div class="flex flex-col items-start justify-center space-y-4">
          <div class="text-sm font-bold">Reasons for change:</div>
          <div class="text-sm text-white/70">
            We're moving from HotorNot to
            <a
              target="_blank"
              class="font-bold text-[#E2017B] underline"
              href="https://yral.com">
              Yral.com
            </a>
            to start anew. We won't support HotorNot's technology anymore, and all
            our team's future activities will be on Yral.com.
          </div>
          <div class="text-sm font-bold">What's Being Transferred:</div>
          <div class="text-sm text-white/70">
            Your COYN tokens and videos from your old HotorNot account will be
            moved to a new Yral account.
          </div>
          <div class="text-sm font-bold">Steps to Follow:</div>
          <ul class="text-sm text-white/70">
            <li>1. Go to Yral.com.</li>
            <li>2. Navigate to Menu > HotorNot Account Transfer</li>
            <li>3. Login with Google.</li>
            <li>4. Copy the Yral Principal ID.</li>
            <li>5. Return and fill out the form.</li>
          </ul>
        </div>
        <div class="h-1 w-10 border-t border-dashed border-white"></div>
        {#if $authState.isLoggedIn}
          <div class="text-center text-sm font-medium">
            Go to <a
              target="_blank"
              class="font-bold text-[#E2017B] underline"
              href="https://yral.com">
              Yral.com
            </a>
            and get your Yral Principal id before proceeding.
          </div>
          <Button class="w-full" href="/migrate/form">Proceed</Button>
        {:else}
          <Button class="w-full" on:click={() => ($authState.showLogin = true)}>
            Login
          </Button>
        {/if}
      </div>
    {/if}
  </div>
</HomeLayout>
