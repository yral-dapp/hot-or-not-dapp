<script lang="ts">
import IconButton from '$components/button/IconButton.svelte';
import HomeIcon from '$components/icons/HomeIcon.svelte';
import MenuIcon from '$components/icons/MenuIcon.svelte';
import PlusIcon from '$components/icons/PlusIcon.svelte';
import TrophyIcon from '$components/icons/TrophyIcon.svelte';
import WalletIcon from '$components/icons/WalletIcon.svelte';
</script>

<div class="mb-2 flex w-full justify-between px-4">
	<IconButton class="flex items-center p-2">
		<HomeIcon class="h-6 w-6 text-white" />
	</IconButton>
	<IconButton class="flex items-center p-2">
		<TrophyIcon class="h-6 w-6 text-white" />
	</IconButton>
	<IconButton href="/upload" class="flex items-center rounded-full bg-primary p-3">
		<PlusIcon class="h-4 w-4 text-white" />
	</IconButton>
	<IconButton class="flex items-center p-2">
		<WalletIcon class="h-6 w-6 text-white" />
	</IconButton>
	<IconButton class="flex items-center p-2">
		<MenuIcon class="h-6 w-6 text-white" />
	</IconButton>
</div>
