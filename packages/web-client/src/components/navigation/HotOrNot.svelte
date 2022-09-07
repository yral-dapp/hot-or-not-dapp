<script lang="ts">
import IconButton from '$components/button/IconButton.svelte';
import BetCoinIcon from '$components/icons/BetCoinIcon.svelte';
import ChevronUpIcon from '$components/icons/ChevronUpIcon.svelte';
import HotIcon from '$components/icons/HotIcon.svelte';
import NotIcon from '$components/icons/NotIcon.svelte';

function increaseBet() {
	if (coinsBet < 990) {
		coinsBet += 10;
		coinsBet = coinsBet;
	}
}

function decreaseBet() {
	if (coinsBet > 10) {
		coinsBet -= 10;
	}
}

let coinsBet = 10;
</script>

<hot-or-not class="flex w-full items-center justify-center space-x-8 px-4">
	<div class="flex flex-col items-center space-y-1">
		<IconButton>
			<NotIcon class="h-20" />
		</IconButton>
		<span class="text-sm">Not</span>
	</div>
	<div class="flex flex-col items-center">
		<IconButton
			on:click="{(e) => {
				e.stopImmediatePropagation();
				increaseBet();
			}}"
			class="z-[10] flex items-center p-4"
		>
			<ChevronUpIcon class="h-2" />
		</IconButton>
		<div class="relative h-20 w-20">
			<BetCoinIcon class="h-20" />
			<div class="absolute inset-0 flex items-center justify-center">
				<span
					style="text-shadow: 3px 3px 0 #EA9C00;"
					class="text-3xl font-extrabold text-[#FFCC00]"
				>
					{coinsBet}
				</span>
			</div>
		</div>
		<IconButton
			on:click="{(e) => {
				e.stopImmediatePropagation();
				decreaseBet();
			}}"
			class="z-[10] flex items-center p-4"
		>
			<ChevronUpIcon class="h-2 rotate-180" />
		</IconButton>
	</div>
	<div class="flex flex-col items-center space-y-1">
		<IconButton>
			<HotIcon class="h-20" />
		</IconButton>
		<span class="text-sm">Hot</span>
	</div>
</hot-or-not>
