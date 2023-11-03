<script lang="ts">
import Button from '$components/button/Button.svelte'
import Icon from '$components/icon/Icon.svelte'
import { authState, loading } from '$stores/auth'
import { getApp } from 'firebase/app'
import {
  GoogleAuthProvider,
  getAdditionalUserInfo,
  getAuth,
  signInWithPopup,
} from 'firebase/auth'

function signIn() {
  $loading = true
  const provider = new GoogleAuthProvider()
  provider.addScope('https://www.googleapis.com/auth/contacts.readonly')

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
      console.log({ token, user, additionalInfo })
      $authState.isLoggedIn = true
      $loading = false
    })
    .catch((error) => {
      $loading = false
      const errorCode = error.code
      const errorMessage = error.message

      const email = error.customData.email

      const credential = GoogleAuthProvider.credentialFromError(error)
      console.log({ errorCode, errorMessage, email, credential })
    })
}
</script>

{#if $loading}
  <div class="flex h-[6.5rem] items-center justify-center space-x-2">
    <Icon name="loading" class="h-4 w-4 animate-spin" />
    <span class="opacity-20">Loading</span>
  </div>
{:else}
  <div class="flex h-24 w-full max-w-xs items-center justify-center">
    <Button on:click={() => signIn()} class="w-full">Login</Button>
  </div>
{/if}
