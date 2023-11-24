<script lang="ts">
import { goto } from '$app/navigation'
import { page } from '$app/stores'
import { authState } from '$stores/auth'
import { onMount } from 'svelte'

function checkIfInviteIsValid() {
  const refById = $page.url.searchParams.get('userId')
  if (!refById) {
    goto('/')
  } else {
    $authState.refById = refById
  }
}

onMount(() => {
  checkIfInviteIsValid()
})
</script>
