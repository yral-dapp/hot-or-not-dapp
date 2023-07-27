<script>
import Button from '$components/button/Button.svelte'
import AirdropCompleteGraphics from '$components/icons/AirdropCompleteGraphics.svelte'
import { airdropEntryDetails } from '$lib/helpers/airdrop'
import { authState } from '$stores/auth'
import { loadingAuthStatus } from '$stores/loading'

let wallet = {
  coyn: '0',
  hot: 0,
  loading: true,
}

async function refreshTokenBalance() {
  if (!$authState.idString) return
  wallet.loading = true
  wallet.error = false
  const res = await airdropEntryDetails($authState.idString)
  if (res) {
    wallet.coyn = res?.FinalCOYNWalletBalance
    wallet.hot = res?.FinalHotTokens
    wallet.loading = false
  }
}

$: authorized = $authState.isLoggedIn && !$loadingAuthStatus
$: authorized && refreshTokenBalance()
</script>

<div class="max-w-80 mt-4 px-16 sm:mt-10 sm:!max-h-80">
  <AirdropCompleteGraphics class="h-full w-full" />
</div>
<div class="flex w-full max-w-md flex-col items-center space-y-4 px-16">
  <div class="text-3xl font-bold uppercase text-transparent text-white">
    Well done!
  </div>
  <div class="text-md text-center">
    You have successfully submitted your NNS Principal ID to claim your airdrop.
  </div>
  {#if !wallet.loading}
    <div class="text-md text-center text-primary">
      Your Hot token allocation: {wallet.hot} HOT tokens
    </div>
  {/if}
  <div class="py-4 text-center text-sm">
    The HOT tokens will be transferred to your NNS wallet by our team over the
    course of a few months as we go through the process manually with over
    16,000 winners. Please be patient and check our socials for updates.
  </div>

  <Button href="/hotornot" class="w-full">Play to earn</Button>
</div>
