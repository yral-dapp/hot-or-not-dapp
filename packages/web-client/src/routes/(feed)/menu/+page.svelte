<script lang="ts">
import { authState, loadingAuthStatus } from '$lib/stores/auth'
import LogoutPopup from '$lib/components/popup/LogoutPopup.svelte'
import { page } from '$app/stores'
import { appPrefs, userProfile } from '$lib/stores/app'
import LoginButton from '$lib/components/auth/LoginButton.svelte'
import { onMount } from 'svelte'
import { handleParams } from '$lib/utils/params'
import type { IconName } from '@hnn/components/icon/icon.type'
import Icon from '@hnn/components/icon/Icon.svelte'
import Switch from '@hnn/components/switch/Switch.svelte'
import { WEBCLIENT_CANISTER_ID } from '$lib/helpers/backend'

let links: {
  icon: IconName
  title: string
  class?: string
  href?: string
  onClick?: () => void
  hide?: boolean
}[] = []

$: links = [
  // {
  //   icon: 'yral',
  //   title: 'Migrate to YRAL',
  //   class: 'fill-white w-6 h-6',
  //   href: '/migrate',
  // },
  // {
  //   icon: 'help',
  //   title: 'Account migration FAQ',
  //   class: 'fill-white w-6 h-6',
  //   href: '/migrate-faq',
  // },
  {
    icon: 'notebook',
    title: 'Terms of Service',
    href: '/terms-of-service',
  },
  {
    icon: 'lock',
    title: 'Privacy Policy',
    href: '/privacy-policy',
  },
  {
    icon: 'logout',
    title: 'Logout',
    class: 'w-5 h-5 pl-1',
    onClick: () => (showLogoutPopup = true),
    hide: !$authState.isLoggedIn,
  },
]

let showLogoutPopup = false

$: userId = $userProfile.username_set
  ? $userProfile.unique_user_name || $authState.idString
  : $authState.idString

onMount(() => {
  handleParams()
})
</script>

<svelte:head>
  <title>Menu | Hot or Not</title>
</svelte:head>

<LogoutPopup bind:show={showLogoutPopup} />

<div
  class="flex h-full w-full flex-col justify-between space-y-16 overflow-hidden overflow-y-auto px-8 py-20">
  <div class="flex w-full shrink-0 flex-col space-y-10">
    {#if $authState.isLoggedIn && !$loadingAuthStatus}
      <div class="sticky flex w-full items-center space-x-4 pb-2">
        <img
          alt="profile"
          class="h-24 w-24 rounded-full object-cover"
          src={$userProfile.profile_picture_url} />
        <div class="flex flex-col space-y-1">
          <div class="text-xl">
            {$userProfile.display_name}
          </div>
          <a
            href="/profile/{userId}"
            data-sveltekit-preload-data="tap"
            class=" text-primary">
            View Profile
          </a>
        </div>
      </div>
    {:else}
      <div class="flex items-center justify-center">
        <LoginButton
          loading={$loadingAuthStatus}
          on:click={() => ($authState.showLogin = true)} />
      </div>
    {/if}
    <div class="my-8 h-[1px] w-full bg-white/10" />
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4 text-white">
        <Icon name="nsfw" class="h-6 w-6" />
        <div>Show NSFW videos</div>
      </div>
      <Switch bind:checked={$appPrefs.showNsfwVideos} />
    </div>
    {#each links as link}
      {#if !link.hide}
        <svelte:element
          this={link.href ? 'a' : 'button'}
          role="presentation"
          on:click={link.onClick}
          target={link.href?.includes('http') ? '_blank' : ''}
          href={link.href}
          data-sveltekit-preload-data="tap"
          class="flex items-center justify-between">
          <div class="flex items-center space-x-4 text-white">
            <Icon name={link.icon} class={link.class ?? 'h-6 w-6'} />
            <div>{link.title}</div>
          </div>
          <Icon name="caret-left" class="h-6 w-6 rotate-180" />
        </svelte:element>
      {/if}
    {/each}
  </div>
  <div class="flex flex-col items-center justify-center space-y-4">
    <div class="text-sm text-white/50">Follow us on</div>
    <div class="flex items-center space-x-4">
      <a
        href="https://t.me/+c-LTX0Cp-ENmMzI1"
        target="_blank"
        class="flex h-12 w-12 items-center justify-center rounded-full border-[1px] border-primary transition-colors duration-200 active:bg-primary">
        <Icon name="telegram-logo" class="h-5 w-5 -translate-x-[1px]" />
      </a>
      <a
        href="https://discord.gg/GZ9QemnZuj"
        target="_blank"
        class="flex h-12 w-12 items-center justify-center rounded-full border-[1px] border-primary transition-colors duration-200 active:bg-primary">
        <Icon name="discord-logo" class="h-5 w-5" />
      </a>
      <a
        href="https://twitter.com/hotornot_dapp"
        target="_blank"
        class="flex h-12 w-12 items-center justify-center rounded-full border-[1px] border-primary transition-colors duration-200 active:bg-primary">
        <Icon name="twitter-logo" class="h-4 w-4" />
      </a>
      {#if !$page.url.host.includes('ic0.app')}
        <a
          href="https://{WEBCLIENT_CANISTER_ID}.raw.ic0.app"
          class="flex h-12 w-12 items-center justify-center rounded-full border-[1px] border-primary transition-colors duration-200 active:bg-primary">
          <Icon name="ic-app" class="h-5 w-5" />
        </a>
      {/if}
    </div>
    <div class="pb-2">
      <Icon name="on-chain-dfinity-graphics" class="h-14" />
    </div>
  </div>
</div>
