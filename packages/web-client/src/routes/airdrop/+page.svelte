<script lang="ts">
import AirdropForm from '$components/airdrop-form/AirdropForm.svelte'
import IconButton from '$components/button/IconButton.svelte'
import CaretLeftIcon from '$components/icons/CaretLeftIcon.svelte'
import HomeLayout from '$components/layout/HomeLayout.svelte'
import goBack from '$lib/utils/goBack'
import { navigateBack } from '$stores/navigation'
import { authState } from '$stores/auth'
import { loadingAuthStatus } from '$stores/loading'
import { isFormFilled } from '$lib/helpers/airdrop'
import AirdropCompleted from '$components/airdrop-form/AirdropCompleted.svelte'
import AirdropCompleteGraphics from '$components/icons/AirdropCompleteGraphics.svelte'
import Button from '$components/button/Button.svelte'
import TelegramIcon from '$components/icons/TelegramIcon.svelte'
import DiscordIcon from '$components/icons/DiscordIcon.svelte'
import TwitterIcon from '$components/icons/TwitterIcon.svelte'

let participated = false
let loading = true

$: authorized = $authState.isLoggedIn && !$loadingAuthStatus
$: authorized && checkIfCompleted()

async function checkIfCompleted() {
  if ($authState.idString) {
    participated = await isFormFilled($authState.idString)
  }
  loading = false
}
</script>

<svelte:head>
  <title>Airdrop | Hot or Not</title>
</svelte:head>

<HomeLayout>
  <svelte:fragment slot="top">
    <div
      class="flex w-full items-center justify-center bg-black py-4 shadow-xl shadow-black/50">
      Airdrop
      <div class="absolute left-4 top-4">
        <IconButton
          on:click={() => goBack($navigateBack || '/menu', true)}
          class="shrink-0">
          <CaretLeftIcon class="h-7 w-7" />
        </IconButton>
      </div>
    </div>
  </svelte:fragment>
  <svelte:fragment slot="content">
    <div class="relative mx-auto block h-full w-full max-w-2xl">
      <div
        class="flex h-full w-full flex-col items-center justify-center gap-8 overflow-hidden overflow-y-auto p-3 text-center md:p-8">
        <AirdropCompleteGraphics class="h-max w-64 shrink-0" />
        <div class="text-3xl font-bold text-transparent text-white">
          Airdrop Registration Has Ended
        </div>
        {#if !authorized}
          <div>
            Thank you for your interest! We are no longer accepting new
            registrations. Follow our socials for more information
          </div>
        {:else if participated}
          <div>
            You have successfully claimed your airdrop. Now, continue to bet on
            videos to earn more coyns and you can visit the below link anytime
            to check your airdrop balance.
          </div>
        {:else if !participated}
          <div>
            Thank you for your interest! We are no longer accepting new
            registrations. Follow our socials for more information
          </div>
        {/if}
        <Button href="/hotornot" class="px-24">Play to Earn</Button>
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
    </div>
  </svelte:fragment>
</HomeLayout>
