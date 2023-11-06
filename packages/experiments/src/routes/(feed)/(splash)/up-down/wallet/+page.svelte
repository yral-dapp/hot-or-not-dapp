<script lang="ts">
import LoginButton from '$components/auth/LoginButton.svelte'
import Avatar from '$components/avatar/Avatar.svelte'
import IconButton from '$components/button/IconButton.svelte'
import Icon from '$components/icon/Icon.svelte'
import { getDb } from '$lib/db'
import type {
  CollectionName,
  ProfileRecord,
  TransanctionRecord,
} from '$lib/db/db.types'
import getDefaultImageUrl from '$lib/utils/getDefaultImageUrl'
import { anonUser, authState } from '$stores/auth'
import userProfile from '$stores/userProfile'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore/lite'
import { onMount, tick } from 'svelte'

let transactions: TransanctionRecord[] = []

async function updateWalletBalance() {
  const db = getDb()
  if ($authState.isLoggedIn && $authState.userId) {
    const docRef = doc(db, 'profile' as CollectionName, $authState.userId)
    const data = (await getDoc(docRef)).data() as ProfileRecord
    if (data) {
      $userProfile.experimentsBalance = data.experimentsBalance
    }
  }
}

$: $authState.isLoggedIn && updateWalletBalance()

$: walletBalance = $authState.isLoggedIn
  ? $userProfile.experimentsBalance || 1000
  : $anonUser.experimentsBalance

let loading = true

async function getTransactions() {
  try {
    await tick()
    const db = getDb()
    const col = collection(db, 'transactions' as CollectionName)
    if ($authState.isLoggedIn) {
      const data = await getDocs(
        query(
          col,
          where('uid', '==', $authState.userId),
          where('anon', '==', false),
        ),
      )
      data.forEach((doc) => {
        transactions.push(doc.data() as TransanctionRecord)
      })
    } else {
      const data = await getDocs(
        query(col, where('uid', '==', $anonUser.id), where('anon', '==', true)),
      )
      data.forEach((doc) => {
        transactions.push(doc.data() as TransanctionRecord)
      })
    }
  } catch (e) {
    console.error('Error loading votes', e)
  } finally {
    loading = false
  }
}

onMount(() => getTransactions())
</script>

<div class="mt-20 flex h-full w-full flex-col overflow-hidden bg-black px-4">
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-4">
      <IconButton
        href="/up-down"
        iconName="caret-left"
        iconClass="text-white w-6 h-6" />
      <div class="flex flex-col items-center py-4">
        <div class="self-start text-xs">Welcome!</div>
        <div class="text-lg font-bold text-white">{$userProfile.name}</div>
      </div>
    </div>
    <Avatar
      src={$authState.isLoggedIn
        ? $userProfile.photoUrl
        : getDefaultImageUrl($anonUser.id)}
      class="h-10 w-10" />
  </div>
  <div class="flex flex-col items-center gap-5 pt-12">
    {#if !$authState.isLoggedIn}
      <LoginButton />
    {/if}
    <div class="flex flex-col items-center gap-1">
      <div class="text-xs font-bold uppercase">Your coYn balance</div>
      <div class="text-5xl font-bold">{walletBalance}</div>
    </div>
  </div>
  {#if loading}
    <Icon name="loading" class="h-4 w-4 animate-spin-slow" />
  {:else if transactions.length}
    <div class="pt-10 text-xs">Recent transactions</div>
    <div
      class="flex h-full flex-col divide-y-[1px] divide-white/10 overflow-hidden overflow-y-auto py-4">
      {#each new Array(15) as _}
        <div class="flex items-center justify-between py-4">
          <div class="flex items-center space-x-4">
            <div
              class="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 p-2">
              <div
                class="flex h-full w-full items-center justify-center rounded-full border-2 border-primary bg-transparent">
                <Icon name="arrow-up" class="h-6 w-6" />
              </div>
            </div>
            <div class="flex flex-col">
              <div class="text-sm">Won Up/Down Video</div>
              <div class="flex items-center space-x-1 text-xs text-white/50">
                <span>100 Coins</span>
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <div class="mt-16 flex items-center justify-center text-sm">
      <div>You have not yet placed any votes. Go play the game!</div>
    </div>
  {/if}
</div>
