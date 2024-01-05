<script lang="ts">
import Button from '@hnn/components/button/Button.svelte'
import { isDev } from '$lib/db/dev'
import { authState } from '$lib/stores/auth'
import { onMount } from 'svelte'

let allowed = false
let loading = true

async function checkIfAllowed() {
  if (!$authState.isLoggedIn) return
  const req = await isDev()
  allowed = req.allow
  loading = false
}

onMount(() => checkIfAllowed())
</script>

{#if !allowed}
  <div
    class="text-fg-1 flex h-full w-full flex-col items-center justify-center bg-black text-white">
    <div>Oops! Seems like you are lost</div>
    <Button href="/">Go to Home</Button>
  </div>
{:else}
  <div class="flex select-text flex-col space-y-4 p-4 text-white">
    <a class="text-primary underline" href="/dev/config">Feed params config</a>
    <a class="text-primary underline" href="/dev/export">Export data</a>
  </div>
{/if}
