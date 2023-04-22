<script lang="ts">
import CopyIcon from '$components/icons/CopyIcon.svelte'
import Log from '$lib/utils/Log'
import { onDestroy } from 'svelte'

export let textToCopy = ''

let copied = false
let copyTimeout: NodeJS.Timeout

async function copy() {
  try {
    await navigator.clipboard.writeText(textToCopy)
    copied = true
    copyTimeout = setTimeout(() => {
      copied = false
    }, 1000)
  } catch (e) {
    Log({ error: e, from: '1 copyLink' }, 'warn')
  }
}
onDestroy(() => {
  if (copyTimeout) {
    clearTimeout(copyTimeout)
  }
})
</script>

<button
  on:click={copy}
  on:click
  class="flex w-min min-w-[5.5rem] items-center justify-center space-x-2 rounded-md bg-primary/10 px-2 py-1 text-sm text-primary">
  <CopyIcon class="h-4 w-4" />
  <span>{copied ? 'Copied' : 'Copy'}</span>
</button>
