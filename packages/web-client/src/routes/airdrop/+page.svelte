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
      Airdrop Claim Form
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
    <AirdropForm />
  </svelte:fragment>
</HomeLayout>
