<script lang="ts" context="module">
export type BetStatus = 'lost' | 'won' | 'pending';

const betKeyword: Record<BetStatus, string> = {
	lost: 'lost',
	pending: 'bet',
	won: 'received'
};
</script>

<script lang="ts">
import Avatar from '$components/avatar/Avatar.svelte';
import TimerIcon from '$components/icons/TimerIcon.svelte';

export let me: boolean;
export let id: string;
export let imageBg: string;
export let username: string;
export let bet: {
	tokens: number;
	status: BetStatus;
	secondsLeft?: number;
};

$: YOU = me ? 'You' : '';
</script>

<a
	href="{`/all/${id}`}"
	data-sveltekit-prefetch
	class="relative h-64 w-full cursor-pointer rounded-md bg-cover"
	style="background-image: url('{imageBg}')">
	<div
		style="background: linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.6) 100%);"
		class="pointer-events-none absolute inset-0 z-[1]">
	</div>
	<div class="pointer-events-none absolute inset-x-0 bottom-2 z-[2] flex flex-col px-2">
		<span class="text-xs font-thin uppercase">{YOU} {betKeyword[bet.status]}</span>
		<span class="pb-2 text-lg font-bold">{bet.tokens} Tokens</span>
		{#if bet.status === 'lost'}
			<div
				class="flex w-full items-center justify-center rounded-full bg-red-600 py-2 text-sm text-white">
				{YOU} Lost
			</div>
		{:else if bet.status === 'won'}
			<div
				class="flex w-full items-center justify-center rounded-full bg-green-400 py-2 text-sm text-white">
				{YOU} Won
			</div>
		{:else}
			<div
				class="flex w-full items-center justify-center space-x-1 rounded-full bg-orange-500 py-2 text-sm text-white">
				<TimerIcon class="h-4 w-4" />
				<span>18m 50s</span>
			</div>
		{/if}
	</div>
	<div class="pointer-events-none absolute inset-x-0 top-2 z-[2] flex items-center space-x-1 px-2">
		<Avatar
			class="h-6 w-6"
			src="https://images.pexels.com/photos/11042025/pexels-photo-11042025.jpeg?auto=compress&cs=tinysrgb&h=200" />
		<div class="text-xs">
			{username}
		</div>
	</div>
</a>
