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
import { generateRandomName } from '$lib/utils/randomUsername'
import { anonUser, authState } from '$stores/auth'
import userProfile from '$stores/userProfile'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from 'firebase/firestore'
import { onMount, tick } from 'svelte'

let transactions: TransanctionRecord[] = []

$: walletBalance = $authState.isLoggedIn
  ? $userProfile.experimentsBalance || 1000
  : $anonUser.experimentsBalance

let loading = true

$: $authState.isLoggedIn && updateWalletBalance()

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
          orderBy('created_at', 'desc'),
        ),
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

<div class="flex h-full w-full flex-col overflow-hidden bg-black px-4">
  {#if loading}
    <div class="mt-20 flex w-full flex-col items-center justify-center gap-2">
      <Icon name="loading" class="h-4 w-4 animate-spin-slow" />
      <span>Loading ...</span>
    </div>
  {:else if $authState.isLoggedIn}
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <IconButton
          on:click={() => history.back()}
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
    <div class="flex flex-col items-center gap-5 pt-6">
      {#if !$authState.isLoggedIn}
        <LoginButton />
      {/if}
      <div class="flex flex-col items-center gap-1">
        <div class="text-xs font-bold uppercase">Your token balance</div>
        <div class="text-5xl font-bold">{walletBalance}</div>
      </div>
    </div>
    {#if loading}
      <div class="mt-20 flex w-full flex-col items-center justify-center gap-2">
        <Icon name="loading" class="h-4 w-4 animate-spin-slow" />
        <span>Loading ...</span>
      </div>
    {:else if transactions.length}
      <div class="pt-10 text-xs">Recent transactions</div>
      <div
        class="flex h-full flex-col divide-y-[1px] divide-white/10 overflow-hidden overflow-y-auto py-4">
        {#each transactions as transaction}
          <div class="flex items-center justify-between py-4">
            <a
              href="/up-down/votes/{transaction.voteId}"
              class="flex w-full items-center space-x-4">
              <div
                class="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 p-2">
                <div
                  class="flex h-full w-full items-center justify-center rounded-full border-2 border-primary bg-transparent">
                  <Icon
                    name="arrow-up"
                    class="h-6 w-6 {transaction.debit ? '' : 'rotate-180'}" />
                </div>
              </div>
              <div class="flex flex-col">
                <div class="text-sm">
                  {#if transaction.type === 'vote-placed'}
                    Placed vote on a video
                  {/if}
                </div>
                <div class="flex items-center space-x-1 text-xs text-white/50">
                  <span>{transaction.amount} Tokens</span>
                </div>
              </div>
            </a>
          </div>
        {/each}
      </div>
    {:else}
      <div
        class="mt-24 flex w-full grow flex-col items-center justify-center gap-2">
        <Icon name="transactions-graphic" class="w-full max-w-sm px-10" />
        <div class="pt-4 text-center opacity-70">No transactions yet</div>
      </div>
    {/if}
  {:else}
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <IconButton
          href="/up-down"
          iconName="caret-left"
          iconClass="text-white w-6 h-6" />
        <div class="flex flex-col items-center py-4">
          <div class="self-start text-xs">Welcome!</div>
          <div class="text-lg font-bold text-white">
            {generateRandomName('name', $anonUser.id)}
          </div>
        </div>
      </div>
      <Avatar src={getDefaultImageUrl($anonUser.id)} class="h-10 w-10" />
    </div>
    <div class="mt-8 flex flex-col items-center gap-4">
      <div>Login to view your wallet</div>
      <LoginButton />
    </div>
  {/if}
</div>
