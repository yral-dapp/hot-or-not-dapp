<script lang="ts">
import Button from '@hnn/components/button/Button.svelte'
import Icon from '@hnn/components/icon/Icon.svelte'
import IconButton from '@hnn/components/button/IconButton.svelte'
import { authState, loading } from '$stores/auth'
import { getApp } from 'firebase/app'
import {
  GoogleAuthProvider,
  getAdditionalUserInfo,
  getAuth,
  signInWithPopup,
} from 'firebase/auth'

let error = ''

function signIn() {
  $loading = true
  const provider = new GoogleAuthProvider()
  provider.addScope('profile')
  provider.addScope('email')

  const app = getApp()
  const auth = getAuth(app)
  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result)
      if (!credential) {
        console.log('error while logging in')
        return
      }
      const token = credential.accessToken
      const user = result.user
      const additionalInfo = getAdditionalUserInfo(result)

      $authState.isLoggedIn = true
      $loading = false
      $authState.showLogin = false
    })
    .catch((error) => {
      $loading = false
      const errorCode = error.code
      const errorMessage = error.message
      const email = error.customData.email
      const credential = GoogleAuthProvider.credentialFromError(error)

      console.error({ errorCode, errorMessage, email, credential })
    })
}
</script>

<login
  class="fade-in absolute inset-0 z-[100] block h-full w-full bg-black/90 text-white">
  {#if $loading}
    <div class="flex h-[6.5rem] items-center justify-center space-x-2">
      <Icon name="loading" class="h-4 w-4 animate-spin" />
      <span class="opacity-20">Loading</span>
    </div>
  {:else}
    <div
      class="flex h-full w-full flex-col items-center justify-center space-y-32 overflow-y-auto">
      {#if $authState.isLoggedIn}
        <div class="flex w-full max-w-md flex-col items-center space-y-4 px-8">
          <Icon name="checkmark" class="h-10 w-10" />
          <div>You're logged in!</div>
        </div>
      {:else}
        <span class="text-center text-3xl font-bold">Login</span>
        <span class="text-center text-lg">Login to start playing</span>
        <div class="flex w-full max-w-md flex-col items-center space-y-4 px-8">
          <Button
            disabled={$loading}
            on:click={signIn}
            class="h-12 w-full space-x-2 py-3"
            type="secondary">
            <Icon name="google-logo" class="h-6 w-6" />
            <span>Login with Google</span>
          </Button>

          {#if error}
            <div class="text-xs text-red-600">
              {error}
            </div>
          {:else if $loading}
            <span class="text-xs opacity-50">Please wait ...</span>
          {/if}
        </div>
      {/if}
    </div>
    <div class="absolute right-4 top-4">
      <IconButton
        ariaLabel="Close popup"
        iconName="close"
        iconClass="h-8 w-8"
        disabled={$loading}
        on:click={() => ($authState.showLogin = false)} />
    </div>
  {/if}
</login>
