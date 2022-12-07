<script lang="ts">
import ArrowUpIcon from '$components/icons/ArrowUpIcon.svelte';
import NoTransactionsIcon from '$components/icons/NoTransactionsIcon.svelte';
import LoginButton from '$components/login/LoginButton.svelte';
import { fetchHistory, fetchTokenBalance, type TransactionHistory } from '$lib/helpers/profile';
import { authState } from '$stores/auth';
import userProfile from '$stores/userProfile';

let loadBalanced = true;
let loadList = true;

let errorBalance = false;
let errorList = false;

let endOfList = false;
let tokenBalance = 0;
let history: TransactionHistory[] = [];

$: loggedIn = $authState.isLoggedIn;

async function refreshTokenBalance() {
	loadBalanced = true;
	const res = await fetchTokenBalance();
	if (res.error) {
		errorBalance = true;
	} else {
		tokenBalance = res.balance;
	}
	loadBalanced = false;
}

async function loadHistory() {
	if (endOfList) {
		return;
	}

	loadList = true;
	errorList = false;
	const res = await fetchHistory(history.length);

	if (res.error) {
		errorList = true;
		loadList = false;
		return;
	}

	history.push(...res.history);
	history = history;

	console.log(history);

	endOfList = res.endOfList;
	loadList = false;
}

function init() {
	console.log('called init');
	refreshTokenBalance();
	loadHistory();
}

$: loggedIn && init();
</script>

<svelte:head>
	<title>Wallet | Hot or Not</title>
</svelte:head>

{#if !$authState.isLoggedIn}
	<div class="flex h-full w-full flex-col items-center justify-center space-y-2">
		<div class="text-center text-sm opacity-70">Please login to access your wallet</div>
		<LoginButton />
	</div>
{:else}
	<div class="flex h-full w-full flex-col overflow-hidden overflow-y-auto">
		<div class="flex items-center justify-between p-6">
			<div class="flex grow flex-col space-y-1">
				<div class="text-sm">Welcome!</div>
				<div class="text-md font-bold">{$userProfile.display_name}</div>
			</div>
			<img
				class="h-12 w-12 rounded-full object-cover"
				alt="{$userProfile.display_name}"
				src="{$userProfile.profile_picture_url}" />
		</div>
		<div class="flex w-full flex-col items-center justify-center space-y-1 py-4">
			<div class="text-sm uppercase">Your coins balance</div>
			{#if errorBalance}
				<div class="text-sm opacity-50 font-bold">Error loading balance</div>
			{:else if loadBalanced}
				<div class="text-sm opacity-50 font-bold">Loading</div>
			{:else}
				<div class="text-4xl font-bold">{tokenBalance.toLocaleString()}</div>
			{/if}
		</div>

		<!-- <div class="px-6 py-4">
			<div
				class="flex w-full items-center justify-between divide-x-2 divide-white/10 rounded-full bg-white/10 py-4 px-2">
				{#each Array(3) as _}
					<button class="flex grow flex-col items-center space-y-1">
						<div
							class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-transparent">
							<ArrowUpIcon class="h-6 w-6" />
						</div>
						<div class="text-xs">Send</div>
					</button>
				{/each}
			</div>
		</div> -->
		<div class="flex justify-between px-6 pt-4 pb-1">
			<div class="text-sm">Recent Transactions</div>
			<!-- <button class="text-sm opacity-50">See all</button> -->
		</div>
		<div class="flex flex-col space-y-2 divide-y-2 divide-white/10 px-6 pt-4 pb-16">
			{#if errorList}
				<div class="text-sm opacity-50 font-bold">Error fetching transactions</div>
			{:else}
				{#each history as item}
					{@const name = 'NewUserSignup' in item.details ? 'Signup' : 'Referral'}
					<div class="flex items-center justify-between py-4">
						<div class="flex items-center space-x-4">
							<div class="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 p-2">
								<div
									class="flex h-full w-full items-center justify-center rounded-full border-2 border-primary bg-transparent">
									<ArrowUpIcon class="h-6 w-6" />
								</div>
							</div>
							<div class="flex flex-col space-y-1">
								<div>{name}</div>
								<div class="text-sm opacity-50">{item.token} Coins</div>
							</div>
						</div>
						<div class="text-sm text-green-600">+ {item.token}</div>
					</div>
				{:else}
					<div class="flex grow h-full w-full items-center justify-center">
						<NoTransactionsIcon class="w-full max-w-sm px-10" />
					</div>
					<div class="opacity-70 pt-4 text-center">No transactions yet</div>
				{/each}
			{/if}
		</div>
	</div>
{/if}
