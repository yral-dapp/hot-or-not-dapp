<script lang="ts">
import { goto } from '$app/navigation';
import { authStore } from '$stores/auth';
import userProfile from '$stores/userProfile';
import { onMount } from 'svelte';

onMount(() => {
	if (!$authStore.isLoggedIn) {
		goto('/menu');
	}
	const profileId = $userProfile.unique_user_name[0] || $authStore.principal?.toText();
	console.log({ profileId });
	goto(`/profile/${profileId}` || '/menu');
});
</script>
