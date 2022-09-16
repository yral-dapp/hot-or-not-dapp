<script lang="ts">
import Button from '$components/button/Button.svelte';
import HotOrNotFireIcon from '$components/icons/HotOrNotFireIcon.svelte';
import Log from '$lib/utils/Log';
import { page } from '$app/stores';

const error = $page.error?.message;
const status = $page.status;

function getVariant() {
	return Math.random() < 0.5 ? 'hot' : 'not';
}

Log({ error: 'Page load error', details: error, status }, 'error');
$: statusCode = status.toString().split('');
</script>

<div class="flex h-full w-full flex-col items-center justify-center space-y-8 text-white">
	<div class="flex select-none items-center space-x-4 text-white">
		{#each statusCode as c}
			{#if c == '0'}
				<HotOrNotFireIcon variant="{getVariant()}" class="h-20" />
			{:else}
				<span class="text-8xl">
					{c}
				</span>
			{/if}
		{/each}
	</div>
	<div class="flex flex-col items-center">
		<div class="rounded-4 text-4xl">Oh no!</div>
		<div class="rounded-4 text-md opacity-50">Something went wrong.</div>
	</div>
	<Button href="/">Let me take you to safety</Button>
	<div class="flex flex-col items-center rounded-md bg-white/10 p-2 font-mono text-xs">
		<div>
			Code: {status}
		</div>
		<div>
			Message: {error}
		</div>
	</div>
</div>

<slot />
