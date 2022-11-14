<script lang="ts">
import { page } from '$app/stores';
import NoVideosIcon from '$components/icons/NoVideosIcon.svelte';
import { isPrincipal } from '$lib/utils/isPrincipal';
import { authState, referralId } from '$stores/auth';
import { onMount } from 'svelte';

function handleParams(searchParams: URLSearchParams) {
	const showLogin = searchParams.get('login');
	if (showLogin) {
		$authState.showLogin = true;
	}

	const refId = searchParams.get('refId');
	if (refId && isPrincipal(refId)) {
		$referralId = {
			principalId: refId,
			time: new Date().getTime()
		};
	}
}

onMount(() => {
	handleParams($page.url.searchParams);
});
</script>

<div class="flex h-full w-full items-center justify-center">
	<div class="relative flex h-full w-full flex-col items-center justify-center space-y-8 px-8">
		<NoVideosIcon class="w-56" />
		<div class="text-center text-lg font-bold">No video found</div>
	</div>
</div>
