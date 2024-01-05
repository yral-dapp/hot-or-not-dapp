<script lang="ts">
import Icon from '../../icon/Icon.svelte'
import { onDestroy } from 'svelte'

export let textToCopy = ''

let copied = false
let copyTimeout: ReturnType<typeof setTimeout>

async function copy() {
  try {
    await navigator.clipboard.writeText(textToCopy)
    copied = true
    copyTimeout = setTimeout(() => {
      copied = false
    }, 1000)
  } catch (e) {
    console.warn('warn', 'Could not copy to clipboard', {
      error: e,
      from: 'CopyButton.copyLink',
    })
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
  <Icon name="copy" class="h-4 w-4" />
  <span>{copied ? 'Copied' : 'Copy'}</span>
</button>
