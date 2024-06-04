<script lang="ts">
import { navigateBack } from '$lib/stores/navigation'
import goBack from '$lib/utils/goBack'
import Button from '@hnn/components/button/Button.svelte'
import IconButton from '@hnn/components/button/IconButton.svelte'
import HomeLayout from '@hnn/components/web-client/layout/HomeLayout.svelte'

let loading = false
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="true" />
  <link
    href="https://fonts.googleapis.com/css2?family=Gloria+Hallelujah&display=swap"
    rel="stylesheet" />
  <title>Migrate FAQ | Hot or Not</title>
</svelte:head>

<HomeLayout>
  <svelte:fragment slot="top">
    <div
      class="flex w-full items-center justify-center bg-black py-4 shadow-xl shadow-black/50">
      Account Migration
      <div class="absolute left-4 top-4 gap-2">
        <IconButton
          iconName="caret-left"
          iconClass="h-7 w-7"
          on:click={() => goBack($navigateBack || '/menu', true)}
          class="shrink-0" />
      </div>
    </div>
  </svelte:fragment>
  <div class="h-full w-full overflow-y-auto" slot="content">
    <div
      class="mx-auto mb-8 mt-16 flex h-full w-full max-w-sm flex-col items-center gap-4 px-8 py-8">
      <div class="text-sm font-bold">
        Find all your answers about the Account transfer here:
      </div>
      <div class="flex flex-col gap-2 rounded-lg bg-white/10 p-4">
        <div class="text-sm font-bold">
          Why is my account being transferred?
        </div>
        <div class="text-sm text-white/70">
          We're moving from HotorNot to <a
            target="_blank"
            class="text-[#E2017B] underline"
            href="https://yral.com">
            Yral.com
          </a>
          to start anew. We won't support HotorNot's technology anymore, and all
          our team's future activities will be on
          <a
            class="text-[#E2017B] underline"
            target="_blank"
            href="https://yral.com">
            Yral.com
          </a>
          .
        </div>
      </div>

      <div class="flex flex-col gap-2 rounded-lg bg-white/10 p-4">
        <div class="text-sm font-bold">
          What will be transferred with my account?
        </div>
        <div class="text-sm text-white/70">
          Your COYN token balance and videos from your HotorNot account will be
          transferred to your new Yral account.
        </div>
      </div>

      <div class="flex flex-col gap-2 rounded-lg bg-white/10 p-4">
        <div class="text-sm font-bold">
          How can I ensure my COYNs are transferred properly and securely?
        </div>
        <div class="pb-2 text-sm text-white/70">
          Follow these steps to ensure secure transfer:
          <ul>
            <li>
              <a class="underline" href="https://yral.com/account-transfer">
                1. Go to Yral.com > Menu > HotorNot Account Transfer
              </a>
            </li>
            <li>2. Login with Google.</li>
            <li>3. Copy the Yral Principal ID.</li>
            <li>4. Return and fill out the form.</li>
          </ul>
        </div>
        <Button href="/migrate">Transfer</Button>
      </div>

      <div class="flex flex-col gap-2 rounded-lg bg-white/10 p-4">
        <div class="text-sm font-bold">
          What are COYN tokens used for on Yral?
        </div>
        <ul class="text-sm text-white/70">
          <li>
            1. COYN tokens can be utilised in the voting games soon to be
            introduced on the yral home feed.
          </li>
          <li>
            2. They will help you stand out from other users in HOT token and
            upcoming airdrops.
          </li>
          <li>
            3. COYN tokens will be the main currency of the app and will be
            useful in participating in creator DAOs, mystery boxes, and other
            planned games.
          </li>
          <li>
            4. An off-boarding mechanism for COYN tokens will be setup on
            yral.com.
          </li>
        </ul>
      </div>
    </div>
  </div>
</HomeLayout>
