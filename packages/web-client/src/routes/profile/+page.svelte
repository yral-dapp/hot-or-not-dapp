<script lang="ts">
import { goto } from '$app/navigation';
import { authState } from '$stores/auth';
import userProfile from '$stores/userProfile';
import { onMount } from 'svelte';

onMount(() => {
	if (!$authState.isLoggedIn) {
		goto('/menu');
	}
	const profileId = $userProfile.unique_user_name[0] || $authState.idString;
	console.log({ profileId });
	goto(`/profile/${profileId}` || '/menu');
});
</script>
