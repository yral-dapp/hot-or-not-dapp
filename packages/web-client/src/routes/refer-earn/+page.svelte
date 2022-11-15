<script lang="ts">
import { page } from '$app/stores';
import Button from '$components/button/Button.svelte';
import IconButton from '$components/button/IconButton.svelte';
import CaretLeftIcon from '$components/icons/CaretLeftIcon.svelte';
import CoinsStashIcon from '$components/icons/CoinsStashIcon.svelte';
import DollarCoinIcon from '$components/icons/DollarCoinIcon.svelte';
import DownloadIcon from '$components/icons/DownloadIcon.svelte';
import ShareArrowIcon from '$components/icons/ShareArrowIcon.svelte';
import HomeLayout from '$components/layout/HomeLayout.svelte';
import DotTabs from '$components/tabs/DotTabs.svelte';
import getDefaultImageUrl from '$lib/utils/getDefaultImageUrl';
import Log from '$lib/utils/Log';
import { generateRandomName } from '$lib/utils/randomUsername';
import { authState } from '$stores/auth';
import userProfile from '$stores/userProfile';

const link = $page.url.host.includes('ic0.app')
	? `https://${import.meta.env.VITE_WEBCLIENT_CANISTER_ID}.raw.ic0.app`
	: `https://${$page.url.host}?refId=${$userProfile.principal_id}&login=true`;

let selectedTab = 0;

function copyLink() {
	try {
		navigator.clipboard.writeText(link);
	} catch (e) {
		Log({ error: e, from: '1 copyLink' }, 'error');
	}
}
</script>

<HomeLayout>
	<svelte:fragment slot="top">
		<div class="flex w-full items-center justify-center bg-black py-4 shadow-xl shadow-black/50">
			Refer & Earn
			<div class="absolute top-4 left-4">
				<IconButton href="/menu">
					<CaretLeftIcon class="h-5 w-5" />
				</IconButton>
			</div>
		</div>
	</svelte:fragment>
	<svelte:fragment slot="content">
		<div
			class="flex h-full w-full flex-col items-center space-y-4 overflow-hidden overflow-y-scroll px-8 pb-20 pt-16">
			<DotTabs bind:selectedIndex="{selectedTab}" tabs="{['How to earn', 'History']}" />
			{#if selectedTab == 0}
				<div class="shrink-0 py-4">
					<CoinsStashIcon class="h-36" />
				</div>
				<div class="text-center text-2xl font-bold">Invite & Win 500 tokens</div>
				{#if $authState.isLoggedIn}
					<div class="text-center text-sm opacity-70">
						Send a referral link to your friends via link/whatsapp and win tokens
					</div>
					<div class="pt-8 text-sm uppercase">referral link</div>
					<div
						class="relative flex w-full items-center justify-between overflow-hidden truncate rounded-full border-2 border-dashed border-primary py-5 px-6 pr-10">
						<span class="w-full select-all truncate whitespace-nowrap  text-xs font-thin"
							>{link}</span>
						<div class="absolute right-0 bg-black px-3">
							<IconButton>
								<ShareArrowIcon on:click="{copyLink}" class="h-6 pr-1" />
							</IconButton>
						</div>
					</div>
				{:else}
					<div class="text-center text-sm opacity-70">Please login to see your referral link</div>
					<div class="flex h-24 w-full items-center justify-center">
						<Button on:click="{() => ($authState.showLogin = true)}" class="w-full">Login</Button>
					</div>
				{/if}
				<div class="pt-8 pb-4">How does it work?</div>
				<div class="flex items-center space-x-8">
					<div class="flex flex-col items-center space-y-3">
						<div class="flex h-12 w-12 items-center justify-center rounded-sm bg-white/10">
							<ShareArrowIcon class="h-5 text-primary" />
						</div>
						<span class="text-center text-xs">Share your link with a friend</span>
					</div>
					<div class="flex flex-col items-center space-y-3">
						<div class="flex h-12 w-12 items-center justify-center rounded-sm bg-white/10">
							<DownloadIcon class="h-5 text-primary" />
						</div>
						<span class="text-center text-xs">Your friends downloads and logs into the app</span>
					</div>
					<div class="flex flex-col items-center space-y-3">
						<div class="flex h-12 w-12 items-center justify-center rounded-sm bg-white/10">
							<DollarCoinIcon class="h-5 text-primary" />
						</div>
						<span class="text-center text-xs">You both win 1,000 tokens each</span>
					</div>
				</div>
			{:else if $authState.isLoggedIn}
				{#each new Array(3) as _, i}
					<div class="flex w-full items-center justify-between py-2 text-white">
						<div class="flex items-center space-x-8">
							<img
								src="{getDefaultImageUrl(i.toString())}"
								alt="avatar"
								class="h-12 w-12 rounded-full object-cover" />
							<div class="flex flex-col items-start">
								<span>{generateRandomName('name', i.toString())}</span>
								<span class="text-sm text-white/50">10 Aug</span>
							</div>
						</div>
						<span>100 Coins</span>
					</div>
				{/each}
			{:else}
				<div class="text-center text-sm opacity-70">Please login to see your referral history</div>
			{/if}
		</div>
	</svelte:fragment>
</HomeLayout>
