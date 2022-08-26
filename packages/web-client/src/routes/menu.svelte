<script lang="ts">
import HomeLayout from '$components/layout/HomeLayout.svelte';
import BottomNavigation from '$components/bottom-navigation/BottomNavigation.svelte';
import ShareArrowIcon from '$components/icons/ShareArrowIcon.svelte';
import CaretLeftIcon from '$components/icons/CaretLeftIcon.svelte';
import TelegramIcon from '$components/icons/TelegramIcon.svelte';
import DiscordIcon from '$components/icons/DiscordIcon.svelte';
import TwitterIcon from '$components/icons/TwitterIcon.svelte';
import CoinBagIcon from '$components/icons/CoinBagIcon.svelte';
import { goto } from '$app/navigation';
import CenterTextIcon from '$components/icons/CenterTextIcon.svelte';
import MessageBoxIcon from '$components/icons/MessageBoxIcon.svelte';
import NotebookIcon from '$components/icons/NotebookIcon.svelte';
import LockIcon from '$components/icons/LockIcon.svelte';
import LogoutIcon from '$components/icons/LogoutIcon.svelte';

const dummy =
	'https://gumlet.assettype.com/freepressjournal/2020-09/e313672e-77ee-4f58-8449-25e5f869b25a/freepressjournal_2020_02_d3038220_213c_42a6_8d5e_b73b090f8da7_EQBBDnKUcAArPz8.jpg';

const links = [
	{
		icon: CoinBagIcon,
		title: 'Refer and Earn',
		class: 'w-5 h-5',
		onClick: () => goto('/refer')
	},
	{
		icon: CenterTextIcon,
		title: 'About Us',
		class: 'w-5 h-5',
		onClick: () => goto('/about-us')
	},
	{
		icon: MessageBoxIcon,
		title: 'FAQs',
		onClick: () => goto('/faq')
	},
	{
		icon: NotebookIcon,
		title: 'Terms of Service',
		onClick: () => goto('/terms-of-service')
	},
	{
		icon: LockIcon,
		title: 'Privacy Policy',
		onClick: () => goto('/refer')
	},
	{
		icon: LogoutIcon,
		title: 'Logout',
		class: 'w-5 h-5 pl-1',
		onClick: () => goto('/logout')
	}
];
</script>

<HomeLayout>
	<svelte:fragment slot="top">
		<div class="flex w-full items-center justify-center bg-black py-4 shadow-xl shadow-black/50">
			Menu
		</div></svelte:fragment
	>
	<svelte:fragment slot="content">
		<div
			class="flex h-full w-full flex-col justify-between space-y-16 overflow-hidden overflow-y-auto py-20 px-8"
		>
			<div class="flex w-full shrink-0 flex-col space-y-10">
				<div class="sticky flex w-full items-center space-x-4 pb-2">
					<img alt="profile" class="h-24 w-24 rounded-full object-cover" src="{dummy}" />
					<div class="flex flex-col space-y-1">
						<div class="text-xl">Harsh</div>
						<div on:click="{() => goto('/profile/1')}" class=" text-primary">View Profile</div>
					</div>
				</div>
				<div class="my-8 h-[1px] w-full bg-white/10"></div>
				{#each links as link}
					<div on:click="{link.onClick}" class="flex items-center justify-between">
						<div class="flex items-center space-x-4 text-white">
							<svelte:component this="{link.icon}" class="{link.class ?? 'h-6 w-6'}" />
							<div>{link.title}</div>
						</div>
						<CaretLeftIcon class="h-6 w-6 rotate-180" />
					</div>
				{/each}
			</div>
			<div class="flex flex-col items-center justify-center space-y-4">
				<div class="text-sm text-white/50">Follow us on</div>
				<div class="flex items-center space-x-4">
					<div
						class="flex h-12 w-12 items-center justify-center rounded-full border-[1px] border-primary transition-colors duration-200 active:bg-primary"
					>
						<TelegramIcon class="h-5 w-5 -translate-x-[1px]" />
					</div>
					<div
						class="flex h-12 w-12 items-center justify-center rounded-full border-[1px] border-primary transition-colors duration-200 active:bg-primary"
					>
						<DiscordIcon class="h-5 w-5" />
					</div>
					<div
						class="flex h-12 w-12 items-center justify-center rounded-full border-[1px] border-primary transition-colors duration-200 active:bg-primary"
					>
						<TwitterIcon class="h-4 w-4" />
					</div>
				</div>
			</div>
		</div>
	</svelte:fragment>
	<div class="w-full" slot="bottom-navigation">
		<BottomNavigation />
	</div>
</HomeLayout>
