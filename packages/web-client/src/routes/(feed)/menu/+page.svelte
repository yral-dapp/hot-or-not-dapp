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
import Button from '$components/button/Button.svelte';
import { onMount } from 'svelte';
import { authStore } from '$stores/auth';
import LogoutPopup from '$components/popup/LogoutPopup.svelte';
import Ic0Icon from '$components/icons/Ic0Icon.svelte';
import { page } from '$app/stores';
import getDefaultImageUrl from '$lib/utils/getDefaultImageUrl';
import { prefetch } from '$app/navigation';
import { generateRandomName } from '$lib/utils/randomUsername';
import userProfile from '$stores/userProfile';

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
		hide: !$authStore.isLoggedIn
	}
];

let showLogoutPopup = false;

function prefetchLinks() {
	links.forEach((link) => {
		link.href && prefetch(link.href);
	});
	prefetch('/profile/1');
}

onMount(() => prefetchLinks());
</script>

<LogoutPopup bind:show="{showLogoutPopup}" />

<div
	class="flex h-full w-full flex-col justify-between space-y-16 overflow-hidden overflow-y-auto py-20 px-8">
	<div class="flex w-full shrink-0 flex-col space-y-10">
		{#if $authStore.isLoggedIn}
			<div class="sticky flex w-full items-center space-x-4 pb-2">
				<img
					alt="profile"
					class="h-24 w-24 rounded-full object-cover"
					src="{$userProfile.profile_picture_url?.[0] ||
						getDefaultImageUrl($authStore.principal)}" />
				<div class="flex flex-col space-y-1">
					<div class="text-xl">
						{$userProfile.display_name?.[0] ||
							generateRandomName('name', $authStore.principal?.toText() ?? '1')}
					</div>
					<a href="/profile/1" data-sveltekit-prefetch class=" text-primary">View Profile</a>
				</div>
			</div>
		{:else}
			<div class="flex h-24 w-full items-center justify-center">
				<Button on:click="{() => ($authStore.showLogin = true)}" class="w-full">Login</Button>
			</div>
		{/if}
		<div class="my-8 h-[1px] w-full bg-white/10"></div>
		{#each links as link}
			{#if !link.hide}
				<svelte:element
					this="{link.href ? 'a' : 'button'}"
					on:click="{link.onClick}"
					href="{link.href}"
					data-sveltekit-prefetch="{link.href ? true : null}"
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
					href="{`https://${process.env.WEBCLIENT_CANISTER_ID}.raw.ic0.app`}"
					class="flex h-12 w-12 items-center justify-center rounded-full border-[1px] border-primary transition-colors duration-200 active:bg-primary">
					<Ic0Icon class="h-5 w-5" />
				</a>
			{/if}
		</div>
	</div>
</div>
