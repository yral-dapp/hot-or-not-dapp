<script lang="ts">
import IconButton from '$components/button/IconButton.svelte'
import ArrowUpIcon from '$components/icons/ArrowUpIcon.svelte'
import CaretLeftIcon from '$components/icons/CaretLeftIcon.svelte'
import LoadingIcon from '$components/icons/LoadingIcon.svelte'
import NoTransactionsIcon from '$components/icons/NoTransactionsIcon.svelte'
import IntersectionObserver from '$components/intersection-observer/IntersectionObserver.svelte'
import ProfileLayout from '$components/layout/ProfileLayout.svelte'
import LoginButton from '$components/login/LoginButton.svelte'
import { fetchHistory, type TransactionHistory } from '$lib/helpers/profile'
import Log from '$lib/utils/Log'
import { authState } from '$stores/auth'

let loading = false
let errorWhileFetching = false
let noMoreTransactions = false
let fetchedTransactionsCount = 0
let transactions: TransactionHistory[] = []

async function loadTransactions() {
  if (noMoreTransactions) {
    return
  }

  loading = true
  errorWhileFetching = false
  try {
    const res = await fetchHistory(fetchedTransactionsCount)

    if (res.error) {
      errorWhileFetching = true
      loading = false
      return
    }

    transactions.push(...res.history)
    transactions = transactions
    noMoreTransactions = res.endOfList
    fetchedTransactionsCount = transactions.length
    loading = false
  } catch (e) {
    Log({ error: e, from: '1 loadLovers' }, 'error')
  }

  loading = false
}
</script>

<ProfileLayout>
  <svelte:fragment slot="top-left">
    <IconButton on:click={() => history.back()} class="shrink-0">
      <CaretLeftIcon class="h-7 w-7" />
    </IconButton>
  </svelte:fragment>
  <div slot="top-center" class="text-lg font-bold">All transactions</div>

  <div
    class="mx-auto flex h-full w-full max-w-5xl flex-col space-y-8 overflow-y-auto p-8"
    slot="content">
    {#if !$authState.isLoggedIn}
      <div class="text-center text-sm opacity-70">
        Please login to access your wallet
      </div>
      <LoginButton />
    {:else}
      {#if transactions.length}
        {#each transactions as item}
          <div class="flex items-center justify-between py-4">
            <div class="flex items-center space-x-4">
              <div
                class="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 p-2">
                <div
                  class="flex h-full w-full items-center justify-center rounded-full border-2 border-primary bg-transparent">
                  {#if item.type === 'Burn' || item.type === 'Stake' || item.type === 'Transfer'}
                    <ArrowUpIcon class="h-6 w-6 " />
                  {:else}
                    <ArrowUpIcon class="h-6 w-6 rotate-180" />
                  {/if}
                </div>
              </div>
              <div class="flex flex-col space-y-1">
                <div>{item.subType?.replace(/([A-Z])/g, ' $1').trim()}</div>
                <div class="text-sm opacity-50">{item.token} Coins</div>
              </div>
            </div>
            <div class="text-sm text-green-600">+ {item.token}</div>
          </div>
        {/each}
      {:else if !loading}
        <div class="flex h-full w-full grow items-center justify-center">
          <NoTransactionsIcon class="w-full max-w-sm px-10" />
        </div>
        <div class="pt-4 text-center opacity-70">No transactions yet</div>
      {/if}

      {#if loading}
        <div class="flex w-full items-center justify-center space-x-2 py-8">
          <LoadingIcon class="h-4 w-4 animate-spin" />
          <span>Loading</span>
        </div>
      {/if}
      {#if noMoreTransactions}
        <div class="flex w-full items-center justify-center space-x-2 py-8">
          <span class="text-white/50">End of list</span>
        </div>
      {/if}
      <IntersectionObserver
        on:intersected={loadTransactions}
        disabled={loading || errorWhileFetching}
        threshold={0.1}
        intersect={!noMoreTransactions}>
        <svelte:fragment>
          <div class="h-2 w-full" />
        </svelte:fragment>
      </IntersectionObserver>
    {/if}
  </div>
</ProfileLayout>
