<script lang="ts">
import Button from '$components/button/Button.svelte';
import ComingSoon from '$components/coming-soon/ComingSoon.svelte';
import ArrowUpIcon from '$components/icons/ArrowUpIcon.svelte';
import { fetchHistory, fetchTokenBalance, type TransactionHistory } from '$lib/helpers/profile';
import { authState } from '$stores/auth';
import userProfile from '$stores/userProfile';
import { onMount } from 'svelte';

let load = {
	balance: true,
	list: true
};

let error = {
	balance: false,
	list: false
};

let endOfList = false;
let tokenBalance = 0;
let history: TransactionHistory[] = [];

async function refreshTokenBalance() {
	const res = await fetchTokenBalance();
	if (res.error) {
		error.balance = true;
		error = error;
	} else {
		tokenBalance = res.balance;
	}
	load.balance = false;
	load = load;
}

async function loadHistory() {
	if (endOfList) {
		return;
	}

	load.list = true;
	error.list = false;
	const res = await fetchHistory(history.length);

	if (res.error) {
		error.list = true;
		load.list = false;
		load = load;
		error = error;
		return;
	}

	history.push(...res.history);
	history = history;

	console.log(history);

	endOfList = res.endOfList;
	load.list = false;
	load = load;
	error = error;
}

onMount(() => {
	refreshTokenBalance();
	loadHistory();
});
</script>

{#if !$authState.isLoggedIn}
	<div class="flex h-full w-full flex-col items-center justify-center space-y-2">
		<div class="text-center text-sm opacity-70">Please login to access your wallet</div>
		<div class="flex h-24 w-full items-center justify-center">
			<Button on:click="{() => ($authState.showLogin = true)}" class="w-full">Login</Button>
		</div>
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
			<div class="text-4xl font-bold">{tokenBalance.toLocaleString()}</div>
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
			{#each history as item}
				{@const tokenCount = item.details['NewUserSignup'] ? 1000 : 500}
				<div class="flex items-center justify-between py-4">
					<div class="flex items-center space-x-4">
						<div class="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 p-2">
							<div
								class="flex h-full w-full items-center justify-center rounded-full border-2 border-primary bg-transparent">
								<ArrowUpIcon class="h-6 w-6" />
							</div>
						</div>
						<div class="flex flex-col space-y-1">
							<div>{Object.keys(item.details)[0]}</div>
							<div class="text-sm opacity-50">{tokenCount} Coins</div>
						</div>
					</div>
					<div class="text-sm text-green-600">+ {tokenCount}</div>
				</div>
			{/each}
		</div>
	</div>
{/if}
