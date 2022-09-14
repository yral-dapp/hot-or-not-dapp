<script lang="ts">
import IconButton from '$components/button/IconButton.svelte';
import CaretLeftIcon from '$components/icons/CaretLeftIcon.svelte';
import CoinsStashIcon from '$components/icons/CoinsStashIcon.svelte';
import CopyIcon from '$components/icons/CopyIcon.svelte';
import DollarCoinIcon from '$components/icons/DollarCoinIcon.svelte';
import DownloadIcon from '$components/icons/DownloadIcon.svelte';
import ShareArrowIcon from '$components/icons/ShareArrowIcon.svelte';
import HomeLayout from '$components/layout/HomeLayout.svelte';
import DotTabs from '$components/tabs/DotTabs.svelte';
import getDefaultImageUrl from '$lib/utils/getDefaultImageUrl';
import Log from '$lib/utils/Log';
import { generateRandomName } from '$lib/utils/randomUsername';

const code = 'HTRNTWT';
let selectedTab = 0;

function copyLink() {
	try {
		navigator.clipboard.writeText(`https://hotornot.wtf/invite/${code}`);
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
				<div class="text-center text-2xl font-bold">Invite & Win upto 10,000 tokens</div>
				<div class="text-center text-sm opacity-70">
					Send a referral link to your friends via link/whatsapp and win tokens
				</div>

				<div class="pt-8 text-sm uppercase">referral code</div>
				<div
					class="flex w-full items-center justify-between rounded-full border-2 border-dashed border-primary py-4 px-6">
					<span class="text-xl font-bold">{code}</span>
					<IconButton>
						<CopyIcon on:click="{copyLink}" class="h-6" />
					</IconButton>
				</div>
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
			{:else}
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
			{/if}
		</div>
	</svelte:fragment>
</HomeLayout>
