<script lang="ts">
import Button from '$components/button/Button.svelte';
import Log from '$lib/utils/Log';

function throwError() {
	Log('Custom exeception thrown', 'error');
}
</script>

<Button on:click="{throwError}">Throw error</Button>
