<script lang="ts">
import { prefetch } from '$app/navigation';
import { page } from '$app/stores';
import IconButton from '$components/button/IconButton.svelte';
import HomeIcon from '$components/icons/HomeIcon.svelte';
import MenuIcon from '$components/icons/MenuIcon.svelte';
import PlusIcon from '$components/icons/PlusIcon.svelte';
import TrophyIcon from '$components/icons/TrophyIcon.svelte';
import WalletIcon from '$components/icons/WalletIcon.svelte';
import { playerState } from '$stores/playerState';
import { onMount } from 'svelte';

$: path = $page.url.pathname;
$: showBg = !(path.includes('feed') || path.includes('post'));

function prefetchLinks() {
	!path.includes('menu') && prefetch('/menu');
	!path.includes('upload') && prefetch('/upload');
	// !path.includes('wallet') && prefetch('/wallet');
	// !path.includes('leaderboard') && prefetch('/leaderboard');
}

onMount(() => prefetchLinks());
</script>

<bottom-nav
	class="flex w-full items-center justify-between px-4 {showBg ? 'bg-black shadow-up' : ''}">
	<IconButton
		href="{`/feed/${$playerState.currentVideosIndex}`}"
		class="relative flex items-center px-2 py-5">
		<HomeIcon filled="{path.includes('feed')}" class="h-6 w-6 text-white" />
		<div
			class:hidden="{!path.includes('feed')}"
			class="absolute bottom-0 w-full bg-primary py-1 blur-md">
		</div>
	</IconButton>
	<IconButton href="/leaderboard" class="relative flex items-center px-2 py-5">
		<TrophyIcon filled="{path.includes('leaderboard')}" class="h-6 w-6 text-white" />
		<div
			class:hidden="{!path.includes('leaderboard')}"
			class="absolute bottom-0 w-full bg-primary py-1 blur-md">
		</div>
	</IconButton>
	<IconButton href="/upload" class="flex items-center rounded-full bg-primary p-3">
		<PlusIcon class="h-4 w-4 text-white" />
	</IconButton>
	<IconButton href="/wallet" class="relative flex items-center px-2 py-5">
		<WalletIcon filled="{path.includes('wallet')}" class="h-6 w-6 text-white" />
		<div
			class:hidden="{!path.includes('wallet')}"
			class="absolute bottom-0 w-full bg-primary py-1 blur-md">
		</div>
	</IconButton>
	<IconButton href="/menu" prefetch class="relative flex items-center px-2 py-5">
		<MenuIcon class="h-6 w-6 {path.includes('menu') ? 'text-primary' : 'text-white'}" />
		<div
			class:hidden="{!path.includes('menu')}"
			class="absolute bottom-0 w-full bg-primary py-1 blur-md">
		</div>
	</IconButton>
</bottom-nav>
