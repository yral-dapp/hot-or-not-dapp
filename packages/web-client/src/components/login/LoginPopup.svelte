<script lang="ts" context="module">
import { imageHost } from '$lib/utils/getDefaultImageUrl'

type LoginType = 'nfid' | 'ii'
const APPLICATION_NAME = encodeURI('Hot or Not')
const APPLICATION_LOGO_URL = encodeURI(
  `${imageHost}/5c66dd44-4bee-47e9-9348-9a20a3358200/public`,
)
const NFID_AUTH_URL =
  'https://nfid.one/authenticate/?applicationName=' +
  APPLICATION_NAME +
  '&applicationLogo=' +
  APPLICATION_LOGO_URL +
  '#authorize'
</script>

<script lang="ts">
import Button from '$components/button/Button.svelte'
import IconButton from '$components/button/IconButton.svelte'
import { registerEvent } from '$components/analytics/GA.svelte'
import { initializeAuthClient } from '$lib/helpers/auth'
import Log from '$lib/utils/Log'
import { authHelper, authState } from '$stores/auth'
import userProfile from '$stores/userProfile'
import { goto } from '$app/navigation'
import { tick } from 'svelte'
import { get } from 'svelte/store'
import Icon from '$components/icon/Icon.svelte'

export let hideNfid = false

let error = ''
let loading = false

function getIdentityProviderURL(type: LoginType) {
  switch (type) {
    case 'ii':
      return import.meta.env.NODE_ENV === 'development'
        ? `http://${process.env.INTERNET_IDENTITY_CANISTER_ID}.localhost:4943`
        : 'https://identity.ic0.app/#authorize'
    case 'nfid':
      return NFID_AUTH_URL
  }
}

async function handleLogin(type: LoginType) {
  registerEvent('login_cta', {
    type,
  })
  loading = true
  await $authHelper.client?.login({
    maxTimeToLive: BigInt(30 * 24 * 60 * 60 * 1000 * 1000 * 1000),
    onSuccess: () => handleSuccessfulLogin(type),
    onError: (e) => handleError(type, e),
    identityProvider: getIdentityProviderURL(type),
    derivationOrigin: `https://${
      import.meta.env.VITE_WEBCLIENT_CANISTER_ID
    }.ic0.app`,
  })
}

async function handleSuccessfulLogin(type: LoginType) {
  try {
    const principal = $authHelper.client?.getIdentity()?.getPrincipal()
    const res = await initializeAuthClient()
    await tick()
    if (!res) throw {}

    if (res.error) {
      Log({ error: 'Signup prevented' }, 'warn')
      $authState.showLogin = false
      registerEvent('sign_up_blocked', {
        login_method: type,
        userId: principal?.toText(),
      })
      goto('/waitlist?logout=true')
      return
    }

    const userProfileData = get(userProfile)

    const referral = res.new_user && res.referral !== 'undefined'

    registerEvent(res.new_user ? 'sign_up' : 'login', {
      login_method: type,
      display_name: userProfileData.display_name,
      username: userProfileData.unique_user_name,
      userId: userProfileData.principal_id,
      referral,
      ...(referral && { referee_user_id: res.referral }),
    })

    loading = false
    $authState.showLogin = false
  } catch (_) {
    loading = false
    error = 'Something went wrong. Please refresh the page and try login again.'
  }
  Log({ type, from: '0 handleSuccessfulLogin' }, 'info')
}

function handleError(type: LoginType, e?: string) {
  error = 'Error while logging in. Please try again or use a different method'
  loading = false
  console.warn('Error while logging in using,', type, ', Details: ', e)
}
</script>

<login
  class="fade-in absolute z-[100] block h-full w-full bg-black/90 text-white">
  <div
    class="flex h-full w-full flex-col items-center justify-center space-y-32 overflow-y-auto">
    <span class="text-3xl font-bold">Join Hot or Not</span>
    <div class="flex w-full max-w-md flex-col items-center space-y-4 px-8">
      <div class="py-4">Create an account using</div>
      {#if !hideNfid}
        <Button
          disabled={loading}
          on:click={async () => await handleLogin('nfid')}
          type="primary"
          class="flex h-12 w-full items-center space-x-3 !bg-white font-normal !text-black">
          <Icon name="google-logo" class="h-6 w-6" />

          <span>Login with Google</span>
        </Button>
      {/if}
      <Button
        disabled={loading}
        on:click={async () => await handleLogin('ii')}
        class="h-12 w-full space-x-2 py-3"
        type="secondary">
        <Icon name="dfinity-logo" class="w-8" />
        <span>Internet Identity</span>
      </Button>

      {#if error}
        <div class="text-xs text-red-600">
          {error}
        </div>
      {:else if loading}
        <span class="text-xs opacity-50">Please wait ...</span>
      {/if}
    </div>
  </div>
  <div class="absolute right-4 top-4">
    <IconButton
      iconName="close"
      iconClass="h-8 w-8"
      disabled={loading}
      on:click={() => ($authState.showLogin = false)} />
  </div>
</login>
