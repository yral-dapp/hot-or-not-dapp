<script lang="ts">
import Button from '@hnn/components/button/Button.svelte'
import { authState } from '$lib/stores/auth'
</script>

<div class="w-full px-8 py-4">
  <Button on:click={() => ($authState.showLogin = true)} class="w-full">
    Log In
  </Button>
</div>
