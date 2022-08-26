<script lang="ts">
import { page } from '$app/stores';
import { auth } from '$stores/auth';
import IconButton from '$components/button/IconButton.svelte';
import HomeIcon from '$components/icons/HomeIcon.svelte';
import MenuIcon from '$components/icons/MenuIcon.svelte';
import PlusIcon from '$components/icons/PlusIcon.svelte';
import TrophyIcon from '$components/icons/TrophyIcon.svelte';
import WalletIcon from '$components/icons/WalletIcon.svelte';
import { goto } from '$app/navigation';

$: path = $page.url.pathname;
$: isLoggedIn = $auth.isLoggedIn;
$: showBg = !path.includes('all');
</script>

<div
	class="flex w-full items-center justify-between py-3 px-4 {showBg ? 'bg-black shadow-up' : ''}"
>
	<IconButton on:click="{() => goto('all')}" class="flex items-center p-2">
		<HomeIcon filled="{path.includes('all')}" class="h-6 w-6 text-white" />
	</IconButton>
	<IconButton class="flex items-center p-2">
		<TrophyIcon class="h-6 w-6 text-white" />
	</IconButton>
	<IconButton
		on:click="{() => goto('/upload')}"
		class="flex items-center rounded-full bg-primary p-3"
	>
		<PlusIcon class="h-4 w-4 text-white" />
	</IconButton>
	<IconButton class="flex items-center p-2">
		<WalletIcon class="h-6 w-6 text-white" />
	</IconButton>
	<IconButton on:click="{() => goto('/menu')}" class="flex items-center p-2">
		<MenuIcon class="h-6 w-6 {path.includes('menu') ? 'text-primary' : 'text-white'}" />
	</IconButton>
</div>
