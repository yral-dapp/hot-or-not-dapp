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
import LoginButton from '$components/login/LoginButton.svelte';
import { registerEvent } from '$components/seo/GoogleAnalytics.svelte';
import DotTabs from '$components/tabs/DotTabs.svelte';
import { fetchHistory, type TransactionHistory } from '$lib/helpers/profile';
import getDefaultImageUrl from '$lib/utils/getDefaultImageUrl';
import Log from '$lib/utils/Log';
import { generateRandomName } from '$lib/utils/randomUsername';
import { authState } from '$stores/auth';
import { loadingAuthStatus } from '$stores/loading';
import userProfile from '$stores/userProfile';
import { onMount } from 'svelte';

const link = $page.url.host.includes('ic0.app')
	? `https://${import.meta.env.VITE_WEBCLIENT_CANISTER_ID}.raw.ic0.app/profile/${
			$userProfile.principal_id
	  }?refId=${$userProfile.principal_id}&login=true`
	: `https://${$page.url.host}/profile/${$userProfile.principal_id}?refId=${$userProfile.principal_id}&login=true`;

let selectedTab = 0;
let endOfList = false;
let loading = true;
let error = false;
let history: TransactionHistory[] = [];

const INVITE_WIN_TOKENS = 500;

async function loadHistory() {
	if (endOfList) {
		return;
	}

	loading = true;
	error = false;
	const res = await fetchHistory(history.length, 'Referral');

	if (res.error) {
		error = true;
		loading = false;
		return;
	}

	history.push(...res.history);
	history = history;

	console.log(history);

	endOfList = res.endOfList;
	loading = false;
}

async function shareLink() {
	try {
		await navigator.share({
			url: link
		});
	} catch (e) {
		Log({ error: e, from: '1 copyLink' }, 'error');
	}
}

function copyLink() {
	try {
		navigator.clipboard.writeText(link);
	} catch (e) {
		Log({ error: e, from: '1 copyLink' }, 'error');
	}
}

onMount(() => {
	if ($authState.isLoggedIn) {
		loadHistory();
		registerEvent('refer_earn_visit', {
			display_name: $userProfile.display_name,
			username: $userProfile.unique_user_name,
			userId: $userProfile.principal_id,
			user_canister_id: $authState.userCanisterId
		});
	}
});

$: loggedIn = $authState.isLoggedIn && !$loadingAuthStatus;
</script>

<svelte:head>
	<title>Refer & Earn | Hot or Not</title>
</svelte:head>

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
				<div class="text-center text-2xl font-bold">Invite & Win {INVITE_WIN_TOKENS} tokens</div>
				{#if loggedIn}
					<div class="text-center text-sm opacity-70">
						Send a referral link to your friends via link/whatsapp and win tokens
					</div>
					<div class="pt-8 text-sm uppercase">referral link</div>
					<div
						class="relative flex w-full items-center justify-between overflow-hidden truncate rounded-full border-2 border-dashed border-primary py-5 px-6 pr-10">
						<span
							role="presentation"
							on:click="{copyLink}"
							class="w-full select-all truncate whitespace-nowrap  text-xs font-thin">
							{link}
						</span>

						<div class="absolute right-0 bg-black px-3">
							<IconButton on:click="{shareLink}">
								<ShareArrowIcon class="h-5 pr-1" />
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
						<span class="text-center text-xs">You both win {INVITE_WIN_TOKENS} tokens each</span>
					</div>
				</div>
			{:else if loggedIn}
				{#each history as item, i}
					{@const date = new Date(Number(item.timestamp.secs_since_epoch))
						.toDateString()
						.substring(4)}
					{@const tokenCount = item.details['NewUserSignup'] ? 1000 : { INVITE_WIN_TOKENS }}
					<div class="flex w-full items-center justify-between py-2 text-white">
						<div class="flex items-center space-x-8">
							<img
								src="{getDefaultImageUrl(i.toString())}"
								alt="avatar"
								class="h-12 w-12 rounded-full object-cover" />
							<div class="flex flex-col items-start">
								<span>{generateRandomName('name', i.toString())}</span>
								<span class="text-sm text-white/50">{date}</span>
							</div>
						</div>
						<span>{tokenCount} Coins</span>
					</div>
				{/each}
				{#if loading}
					<div class="text-center text-sm opacity-70">Loading</div>
				{:else if error}
					<div class="text-center text-sm text-red-500">Error fetching history.</div>
				{:else if !history.length}
					<div class="text-center text-sm opacity-70">No referrals yet.</div>
				{/if}
			{:else}
				<div class="text-center text-sm opacity-70">Please login to see your referral history</div>
				<LoginButton />
			{/if}
		</div>
	</svelte:fragment>
</HomeLayout>
