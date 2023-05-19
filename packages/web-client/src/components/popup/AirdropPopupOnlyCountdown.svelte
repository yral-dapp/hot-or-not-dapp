<script lang="ts">
import AirdropCompleted from '$components/airdrop-form/AirdropCompleted.svelte'
import IconButton from '$components/button/IconButton.svelte'
import AirdropGraphic from '$components/icons/AirdropGraphic.svelte'
import CloseIcon from '$components/icons/CloseIcon.svelte'
import { authState } from '$stores/auth'
import { loadingAuthStatus } from '$stores/loading'
import { showAirdropPopup } from '$stores/popups'
import AirdropCountdown from './AirdropCountdown.svelte'

let loading = true
let participated = false

let loadingEmail = false
let error = ''
let email = ''

let htmlInputEl: HTMLInputElement

async function submitEmail() {
  loadingEmail = true
  try {
    if (htmlInputEl.checkValidity()) {
      // participated = await registerForWaitlist($authState.idString, email)
    }
  } catch (e) {
    email = ''
    error = 'Something went wrong. Please try again'
  }
  loadingEmail = false
}

async function checkIfCompleted() {
  if ($authState.idString) {
    // participated = await isInWaitlist($authState.idString)
    $showAirdropPopup = !participated
  }
  loading = false
}

$: if (!$loadingAuthStatus) {
  if ($authState.isLoggedIn) {
    checkIfCompleted()
  } else {
    loading = false
    $showAirdropPopup = true
  }
}
</script>

{#if $showAirdropPopup}
  <airdrop
    class="fade-in absolute z-[100] block h-full w-full bg-black/90 text-white">
    <div
      class="flex h-full w-full flex-col items-center justify-center gap-10 overflow-y-auto py-8">
      {#if participated}
        <div class="flex h-full w-full flex-col items-center overflow-hidden">
          <AirdropCompleted on:click={() => ($showAirdropPopup = false)} />
        </div>
      {:else}
        <div class="max-w-80 mt-4 px-16 sm:mt-10 sm:!max-h-80">
          <AirdropGraphic class="h-full w-full" />
        </div>
        <div class="flex w-full max-w-md flex-col items-center gap-2 px-16">
          <div class="font-bold text-primary">Coming Soon</div>
          <div
            class="outlined whitespace-nowrap text-4xl font-bold uppercase text-transparent">
            Hot Token
          </div>
          <div class="text-4xl font-bold uppercase text-white">Airdrop</div>
          <div class="py-2 md:py-4">
            <AirdropCountdown />
          </div>

          <div
            class="flex w-full items-center gap-1 rounded-sm bg-[#202125] {loadingEmail
              ? 'pointer-events-none opacity-50'
              : ''}">
            <input
              bind:this={htmlInputEl}
              bind:value={email}
              required
              placeholder="Email me when it releases"
              type="email"
              class="w-full appearance-none border-0 bg-transparent p-3 pr-0 text-xs text-white placeholder:text-white/30 focus:ring-transparent" />
            <button
              disabled={loadingEmail}
              on:click={submitEmail}
              class="h-full shrink-0 rounded-r-sm bg-primary px-3 text-xs text-white">
              Submit
            </button>
          </div>

          <a
            href="/airdrop-guide"
            class="mt-2 text-xs font-thin text-white/70 underline">
            Learn more about the airdrop here
          </a>
        </div>
      {/if}
    </div>
    <div class="absolute right-4 top-4">
      <IconButton
        disabled={loading}
        on:click={() => ($showAirdropPopup = false)}>
        <CloseIcon class="h-8 w-8" />
      </IconButton>
    </div>
  </airdrop>
{/if}

<style>
.outlined {
  -webkit-text-stroke: 1px white;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}
</style>
