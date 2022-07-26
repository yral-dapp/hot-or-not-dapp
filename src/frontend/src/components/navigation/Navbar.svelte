<script lang="ts">
import { fly } from 'svelte/transition';
import ChallengeIcon from '$icons/mdi/boxing-glove.svelte';
import HomeIcon from '$icons/uil/home-alt.svelte';
import LogoutIcon from '$icons/uil/signout.svelte';
import UserIcon from '$icons/uil/user.svelte';
import BrandLogo from '$icons/brand/logo-wide.svelte';
import auth from '$stores/auth/auth';
import isProcessing from '$stores/loading/isProcessing';
import { AuthClient } from '@dfinity/auth-client';
import WalletIcon from '$icons/uil/wallet.svelte';
import { goto } from '$app/navigation';

const navigationLinks = [
	{ textToDisplay: 'Home', url: '/', icon: HomeIcon },
	{
		textToDisplay: 'Challenges',
		url: '/challenge',
		icon: ChallengeIcon
	},
	{
		textToDisplay: 'My Profile',
		url: $auth.isLoggedIn ? `/profile/${$auth.authObject?.getPrincipal().toText()}` : '/login',
		icon: UserIcon
	},
	{
		textToDisplay: 'My Wallet',
		url: $auth.isLoggedIn ? '/wallet/transactions' : '/login',
		icon: WalletIcon
	}
	// { textToDisplay: "Search", url: "/search", icon: SearchIcon },
	// {
	//   textToDisplay: "My Rewards",
	//   url: $session?.uid ? `/profile/${$session.uid}/rewards` : "/login",
	//   icon: RewardIcon,
	// },
];

export let menuOpen: boolean;
</script>

<aside
	class="fixed bottom-8 right-8 h-96 w-64 overflow-y-auto rounded-lg bg-gray-50 shadow"
	transition:fly="{{ duration: 500, x: 400 }}"
>
	<BrandLogo className="w-1/2 mt-2 ml-6 border-b-2 border-g pb-1" />
	<nav>
		<ul>
			{#each navigationLinks as { textToDisplay, url, icon } (textToDisplay)}
				<a
					href="{url}"
					class="block py-2 px-6 text-red-800 hover:bg-red-100 hover:text-red-600 active:bg-red-100 active:text-red-600"
					on:click="{() => (menuOpen = false)}"
				>
					<li class="flex h-10 flex-row items-center">
						<svelte:component this="{icon}" />
						<span>{textToDisplay}</span>
					</li>
				</a>
			{/each}
			{#if $auth.isLoggedIn}
				<button
					class="block w-full py-2 px-6 text-red-800 hover:bg-red-100 hover:text-red-600 active:bg-red-100 active:text-red-600"
				>
					<div
						class="flex h-10 flex-row items-center"
						on:click="{async () => {
							const internetIdentityClient = await AuthClient.create();

							try {
								$isProcessing = true;
								menuOpen = false;
								await internetIdentityClient.logout();
								$auth = {
									isLoggedIn: false
								};
								goto('/');
							} catch (error) {
								console.error(error);
							} finally {
								$isProcessing = false;
							}
						}}"
					>
						<svelte:component this="{LogoutIcon}" />
						<span>Log Out</span>
					</div>
				</button>
			{/if}
		</ul>
	</nav>
</aside>
