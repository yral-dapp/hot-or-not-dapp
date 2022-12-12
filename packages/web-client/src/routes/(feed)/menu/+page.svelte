<script lang="ts">
import CaretLeftIcon from '$components/icons/CaretLeftIcon.svelte';
import TelegramIcon from '$components/icons/TelegramIcon.svelte';
import DiscordIcon from '$components/icons/DiscordIcon.svelte';
import TwitterIcon from '$components/icons/TwitterIcon.svelte';
import CoinBagIcon from '$components/icons/CoinBagIcon.svelte';
import CenterTextIcon from '$components/icons/CenterTextIcon.svelte';
import MessageBoxIcon from '$components/icons/MessageBoxIcon.svelte';
import NotebookIcon from '$components/icons/NotebookIcon.svelte';
import LockIcon from '$components/icons/LockIcon.svelte';
import LogoutIcon from '$components/icons/LogoutIcon.svelte';
import { authState } from '$stores/auth';
import LogoutPopup from '$components/popup/LogoutPopup.svelte';
import Ic0Icon from '$components/icons/Ic0Icon.svelte';
import { page } from '$app/stores';
import userProfile from '$stores/userProfile';
import OnChainDfinityIcon from '$components/icons/OnChainDfinityIcon.svelte';
import LoginButton from '$components/login/LoginButton.svelte';
import WhatsappIcon from '$components/icons/WhatsappIcon.svelte';
import { onMount } from 'svelte';
import { handleParams } from '$lib/utils/params';
import { preloadData } from '$app/navigation';
import { checkSignupStatus } from '$lib/helpers/signup';

$: links = [
	{
		icon: CoinBagIcon,
		title: 'Refer and Earn',
		class: 'w-5 h-5',
		href: '/refer-earn'
	},
	{
		icon: CenterTextIcon,
		title: 'About Us',
		class: 'w-5 h-5',
		href: '/about-us'
	},
	{
		icon: MessageBoxIcon,
		title: 'FAQs',
		href: '/faq'
	},
	{
		icon: WhatsappIcon,
		title: 'Talk to the team',
		class: 'w-5 h-5 pl-0.5',
		href: 'https://wa.me/17863388713'
	},
	{
		icon: NotebookIcon,
		title: 'Terms of Service',
		href: '/terms-of-service'
	},
	{
		icon: LockIcon,
		title: 'Privacy Policy',
		href: '/privacy-policy'
	},
	{
		icon: LogoutIcon,
		title: 'Logout',
		class: 'w-5 h-5 pl-1',
		onClick: () => (showLogoutPopup = true),
		hide: !$authState.isLoggedIn
	}
];

let showLogoutPopup = false;

$: userId = $userProfile.username_set
	? $userProfile.unique_user_name || $authState.idString
	: $authState.idString;

onMount(() => {
	handleParams();
	preloadData('/waitlist');
	checkSignupStatus();
});
</script>

<svelte:head>
	<title>Menu | Hot or Not</title>
</svelte:head>

<LogoutPopup bind:show="{showLogoutPopup}" />

<div
	class="flex h-full w-full flex-col justify-between space-y-16 overflow-hidden overflow-y-auto py-20 px-8">
	<div class="flex w-full shrink-0 flex-col space-y-10">
		{#if $authState.isLoggedIn}
			<div class="sticky flex w-full items-center space-x-4 pb-2">
				<img
					alt="profile"
					class="h-24 w-24 rounded-full object-cover"
					src="{$userProfile.profile_picture_url}" />
				<div class="flex flex-col space-y-1">
					<div class="text-xl">
						{$userProfile.display_name}
					</div>
					<a href="/profile/{userId}" data-sveltekit-preload-data="tap" class=" text-primary"
						>View Profile</a>
				</div>
			</div>
		{:else}
			<div class="flex items-center justify-center">
				<LoginButton />
			</div>
		{/if}
		<div class="my-8 h-[1px] w-full bg-white/10"></div>
		{#each links as link}
			{#if !link.hide}
				<svelte:element
					this="{link.href ? 'a' : 'button'}"
					on:keyup
					on:click="{link.onClick}"
					target="{link.title.includes('team') ? '_blank' : ''}"
					href="{link.href}"
					data-sveltekit-preload-data="tap"
					class="flex items-center justify-between">
					<div class="flex items-center space-x-4 text-white">
						<svelte:component this="{link.icon}" class="{link.class ?? 'h-6 w-6'}" />
						<div>{link.title}</div>
					</div>
					<CaretLeftIcon class="h-6 w-6 rotate-180" />
				</svelte:element>
			{/if}
		{/each}
	</div>
	<div class="flex flex-col items-center justify-center space-y-4">
		<div class="text-sm text-white/50">Follow us on</div>
		<div class="flex items-center space-x-4">
			<div
				class="flex h-12 w-12 items-center justify-center rounded-full border-[1px] border-primary transition-colors duration-200 active:bg-primary">
				<TelegramIcon class="h-5 w-5 -translate-x-[1px]" />
			</div>
			<div
				class="flex h-12 w-12 items-center justify-center rounded-full border-[1px] border-primary transition-colors duration-200 active:bg-primary">
				<DiscordIcon class="h-5 w-5" />
			</div>
			<div
				class="flex h-12 w-12 items-center justify-center rounded-full border-[1px] border-primary transition-colors duration-200 active:bg-primary">
				<TwitterIcon class="h-4 w-4" />
			</div>
			{#if !$page.url.host.includes('ic0.app')}
				<a
					href="{`https://${import.meta.env.VITE_WEBCLIENT_CANISTER_ID}.raw.ic0.app`}"
					class="flex h-12 w-12 items-center justify-center rounded-full border-[1px] border-primary transition-colors duration-200 active:bg-primary">
					<Ic0Icon class="h-5 w-5" />
				</a>
			{/if}
		</div>
		<div class="pb-2">
			<OnChainDfinityIcon class="h-14" />
		</div>
	</div>
</div>
