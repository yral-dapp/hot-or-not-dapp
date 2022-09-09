<script lang="ts">
import IconButton from '$components/button/IconButton.svelte';
import BetCoinIcon from '$components/icons/BetCoinIcon.svelte';
import ChevronUpIcon from '$components/icons/ChevronUpIcon.svelte';
import HotIcon from '$components/icons/HotIcon.svelte';
import NotIcon from '$components/icons/NotIcon.svelte';

function increaseBet() {
	if (coinsBet == 10) coinsBet = 50;
	else if (coinsBet == 50) coinsBet = 100;
}

function decreaseBet() {
	if (coinsBet == 50) coinsBet = 10;
	else if (coinsBet == 100) coinsBet = 50;
}

function toggleBet() {
	if (coinsBet == 100) coinsBet = 10;
	else increaseBet();
}

let coinsBet = 10;
</script>

<hot-or-not class="flex w-full items-center justify-center space-x-8 px-4">
	<div class="pointer-events-auto flex flex-col items-center space-y-1">
		<IconButton
			on:click="{(e) => {
				e.stopImmediatePropagation();
			}}"
		>
			<NotIcon class="h-24" />
		</IconButton>
		<span class="text-sm">Not</span>
	</div>
	<div class="pointer-events-auto flex flex-col items-center">
		<IconButton
			disabled="{coinsBet == 100}"
			on:click="{(e) => {
				e.stopImmediatePropagation();
				increaseBet();
			}}"
			class="z-[10] flex items-center p-4 disabled:opacity-50"
		>
			<ChevronUpIcon class="h-2" />
		</IconButton>
		<button on:click|stopPropagation="{toggleBet}" class="relative h-20 w-20 select-none">
			<BetCoinIcon class="h-20" />
			<div class="absolute inset-0 flex select-none items-center justify-center">
				<span
					style="text-shadow: 3px 3px 0 #EA9C00;"
					class="select-none text-3xl font-extrabold text-[#FFCC00]"
				>
					{coinsBet}
				</span>
			</div>
		</button>
		<IconButton
			on:click="{(e) => {
				e.stopImmediatePropagation();
				decreaseBet();
			}}"
			disabled="{coinsBet == 10}"
			class="z-[10] flex items-center p-4 disabled:opacity-50"
		>
			<ChevronUpIcon class="h-2 rotate-180" />
		</IconButton>
	</div>
	<div class="pointer-events-auto flex flex-col items-center space-y-1">
		<IconButton
			on:click="{(e) => {
				e.stopImmediatePropagation();
			}}"
		>
			<HotIcon class="h-24" />
		</IconButton>
		<span class="text-sm">Hot</span>
	</div>
</hot-or-not>
