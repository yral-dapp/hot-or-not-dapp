<script lang="ts">
import Button from '$components/button/Button.svelte'

function throwError() {
  throw 'Sync error thrown'
}

async function throwAsyncError() {
  throw 'Async error thrown'
}
</script>

<Button on:click={throwError}>Throw sync error</Button>
<Button on:click={throwAsyncError}>Throw async error</Button>
