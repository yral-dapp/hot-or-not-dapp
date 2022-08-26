<script lang="ts">
import { prefetch } from '$app/navigation';

import { page } from '$app/stores';
import IconButton from '$components/button/IconButton.svelte';
import HomeIcon from '$components/icons/HomeIcon.svelte';
import MenuIcon from '$components/icons/MenuIcon.svelte';
import PlusIcon from '$components/icons/PlusIcon.svelte';
import TrophyIcon from '$components/icons/TrophyIcon.svelte';
import WalletIcon from '$components/icons/WalletIcon.svelte';
import { onMount } from 'svelte';

$: path = $page.url.pathname;
$: showBg = !path.includes('all');

function prefetchLinks() {
	!path.includes('menu') && prefetch('/menu');
	!path.includes('all') && prefetch('/all/0');
	!path.includes('upload') && prefetch('/upload');
	// !path.includes('wallet') && prefetch('/wallet');
	// !path.includes('leaderboard') && prefetch('/leaderboard');
}

onMount(() => prefetchLinks());
</script>

<div
	class="flex w-full items-center justify-between py-3 px-4 {showBg ? 'bg-black shadow-up' : ''}"
>
	<IconButton href="/all" prefetch class="flex items-center p-2">
		<HomeIcon filled="{path.includes('all')}" class="h-6 w-6 text-white" />
	</IconButton>
	<IconButton class="flex items-center p-2">
		<TrophyIcon class="h-6 w-6 text-white" />
	</IconButton>
	<IconButton href="/upload" prefetch class="flex items-center rounded-full bg-primary p-3">
		<PlusIcon class="h-4 w-4 text-white" />
	</IconButton>
	<IconButton class="flex items-center p-2">
		<WalletIcon class="h-6 w-6 text-white" />
	</IconButton>
	<IconButton href="/menu" prefetch class="flex items-center p-2">
		<MenuIcon class="h-6 w-6 {path.includes('menu') ? 'text-primary' : 'text-white'}" />
	</IconButton>
</div>
