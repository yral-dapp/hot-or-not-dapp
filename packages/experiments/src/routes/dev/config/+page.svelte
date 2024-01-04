<script lang="ts">
import Button from '@hnn/components/button/Button.svelte'
import { getDb } from '$lib/db'
import type { ViewChangeParameters } from '$lib/db/db.types'
import { createNewConfig, isDev } from '$lib/db/dev'
import { authState } from '$lib/stores/auth'
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore'
import { onMount } from 'svelte'

let allowed = false
let loading = true
let currentParams: ViewChangeParameters | undefined = undefined
let newParams: Omit<ViewChangeParameters, 'created_at' | 'created_by'> = {
  liked: {
    yes: 1,
    no: -1,
  },
  disliked: {
    yes: -5,
    no: 0,
  },
  shared: {
    yes: 1,
    no: 0,
  },
  watched: {
    divisor: 5,
    multiplier: 0.02,
  },
  threshold: {
    minPercentage: 25,
    yes: 1,
    no: -1,
  },
  fullyWatched: {
    yes: 1,
    no: 0,
  },
  minutePassed: -1,
  viewsPerMinute: {
    divisor: 10,
    threshold: 1,
    yes: 0.5,
    no: -0.2,
  },
}

async function checkIfAllowed() {
  if (!$authState.isLoggedIn) return
  const req = await isDev()
  allowed = req.allow
  if (allowed) {
    fetchCurrentParams()
  }
}

async function sendConfigData() {
  try {
    loading = true
    await createNewConfig(newParams as ViewChangeParameters)
    await fetchCurrentParams()
  } finally {
    loading = false
  }
}

async function fetchCurrentParams() {
  try {
    loading = true
    const db = getDb()
    const docs = await getDocs(
      query(
        collection(db, 'view-change-parameters'),
        orderBy('created_at', 'desc'),
        limit(1),
      ),
    )

    if (docs.empty) return
    currentParams = docs.docs[0].data() as ViewChangeParameters
  } finally {
    loading = false
  }
}

onMount(() => checkIfAllowed())
</script>

{#if !allowed}
  <div
    class="text-fg-1 flex h-full w-full flex-col items-center justify-center bg-black text-white">
    <div>Oops! Seems like you are lost</div>
    <Button href="/">Go to Home</Button>
  </div>
{:else}
  <div class="select-text p-4 text-white">
    <div class="border border-white/50 p-4">
      <div class="py-2 text-xl">Current config:</div>
      {#if loading}
        <div>Loading ...</div>
      {:else if currentParams}
        {#each Object.keys(currentParams).sort() as key}
          <pre class="font-mono text-sm"><span>{key}</span> : {JSON.stringify(
              currentParams[key],
              null,
              4,
            )}</pre>
        {/each}
      {:else}
        <div>No config found</div>
      {/if}
    </div>
    <div class="pb-2 pt-8 text-xl">Create new config:</div>
    <div
      class="flex flex-col space-y-4 divide-y divide-gray-500 border border-white/50 p-4">
      <div class="flex flex-col space-y-1 pt-3">
        <div>Score change by like:</div>
        <div class="font-mono text-xs">Formula: (score) ± (like-change)</div>
        <div class="flex items-start space-x-4">
          <label class="flex flex-col">
            <span>If video is liked:</span>
            <input bind:value={newParams.liked.yes} type="number" />
          </label>
          <label class="flex flex-col">
            <span>If video is not liked:</span>
            <input bind:value={newParams.liked.no} type="number" />
          </label>
        </div>
        <div class="text-xs">Change in score:</div>
        <div class="font-mono text-xs">
          Liked: ({newParams.liked.yes}) = {newParams.liked.yes}
        </div>
        <div class="font-mono text-xs">
          Not liked: ({newParams.liked.no}) = {newParams.liked.no}
        </div>
      </div>
      <div class="flex flex-col space-y-1 pt-3">
        <div>Score change by dislike:</div>
        <div class="font-mono text-xs">Formula: (score) ± (dislik-change)</div>
        <div class="flex items-start space-x-4">
          <label class="flex flex-col">
            <span>If video is disliked:</span>
            <input bind:value={newParams.disliked.yes} type="number" />
          </label>
          <label class="flex flex-col">
            <span>If video is not disliked:</span>
            <input bind:value={newParams.disliked.no} type="number" />
          </label>
        </div>
        <div class="text-xs">Change in score:</div>
        <div class="font-mono text-xs">
          Disliked: ({newParams.disliked.yes}) = {newParams.disliked.yes}
        </div>
        <div class="font-mono text-xs">
          Not disliked: ({newParams.disliked.no}) = {newParams.disliked.no}
        </div>
      </div>
      <div class="flex flex-col space-y-1 pt-3">
        <div>Score change by share:</div>
        <div class="font-mono text-xs">Formula: (score) ± (share-change)</div>
        <div class="flex items-start space-x-4">
          <label class="flex flex-col">
            <span>If video is shared:</span>
            <input bind:value={newParams.shared.yes} type="number" />
          </label>
          <label class="flex flex-col">
            <span>If video is not shared:</span>
            <input bind:value={newParams.shared.no} type="number" />
          </label>
        </div>
        <div class="text-xs">Change in score:</div>
        <div class="font-mono text-xs">
          Shared: ({newParams.shared.yes}) = {newParams.shared.yes}
        </div>
        <div class="font-mono text-xs">
          Not shared: ({newParams.shared.no}) = {newParams.shared.no}
        </div>
      </div>
      <div class="flex flex-col space-y-1 pt-3">
        <div>Score change by watching a percentage of video:</div>
        <div class="font-mono text-xs">
          Formula: (score) + (percentage of video watched)/(divisor) *
          (multiplier)
        </div>
        <div class="flex items-start space-x-4">
          <label class="flex flex-col">
            <span>Divisor:</span>
            <input bind:value={newParams.watched.divisor} type="number" />
          </label>
          <label class="flex flex-col">
            <span>Change multiplier:</span>
            <input bind:value={newParams.watched.multiplier} type="number" />
          </label>
        </div>
        <div class="text-xs">Change in score:</div>
        <div class="font-mono text-xs">
          Watched percentage is 15: quotient(15 / {newParams.watched.divisor}) * {newParams
            .watched.multiplier} = {Math.floor(15 / newParams.watched.divisor) *
            newParams.watched.multiplier}
        </div>
        <div class="font-mono text-xs">
          Watched percentage is 29: quotient(29 / {newParams.watched.divisor}) * {newParams
            .watched.multiplier} = {Math.floor(29 / newParams.watched.divisor) *
            newParams.watched.multiplier}
        </div>
        <div class="font-mono text-xs">
          Watched percentage is 100: quotient(100 / {newParams.watched.divisor})
          * {newParams.watched.multiplier} = {Math.floor(
            100 / newParams.watched.divisor,
          ) * newParams.watched.multiplier}
        </div>
      </div>

      <div class="flex flex-col space-y-1 pt-3">
        <div>Score change by watching a minimum-percentage of video:</div>
        <div class="font-mono text-xs">
          Formula: (score) ± (threshold change)
        </div>
        <div class="flex items-start space-x-4">
          <label class="flex flex-col">
            <span>Minimum watched percentage:</span>
            <input
              bind:value={newParams.threshold.minPercentage}
              type="number" />
          </label>
          <label class="flex flex-col">
            <span>Change above threshold:</span>
            <input bind:value={newParams.threshold.yes} type="number" />
          </label>
          <label class="flex flex-col">
            <span>Change below threshold:</span>
            <input bind:value={newParams.threshold.no} type="number" />
          </label>
        </div>
        <div class="text-xs">Change in score:</div>
        <div class="font-mono text-xs">
          Watched percentage is 20: 20% >= {newParams.threshold.minPercentage} ?
          {newParams.threshold.yes}
          : {newParams.threshold.no} = {20 >= newParams.threshold.minPercentage
            ? newParams.threshold.yes
            : newParams.threshold.no}
        </div>
        <div class="font-mono text-xs">
          Watched percentage is 50: 50% >= {newParams.threshold.minPercentage} ?
          {newParams.threshold.yes}
          : {newParams.threshold.no} = {50 >= newParams.threshold.minPercentage
            ? newParams.threshold.yes
            : newParams.threshold.no}
        </div>
      </div>

      <div class="flex flex-col space-y-1 pt-3">
        <div>Score change by watching the video completely:</div>
        <div class="font-mono text-xs">Formula: (score) ± (watch-change)</div>
        <div class="flex items-start space-x-4">
          <label class="flex flex-col">
            <span>If video is watched 100%:</span>
            <input bind:value={newParams.fullyWatched.yes} type="number" />
          </label>
          <label class="flex flex-col">
            <span>If video is not watched 100%:</span>
            <input bind:value={newParams.fullyWatched.no} type="number" />
          </label>
        </div>
        <div class="text-xs">Change in score:</div>
        <div class="font-mono text-xs">
          Fully watched: ({newParams.fullyWatched.yes}) = {newParams
            .fullyWatched.yes}
        </div>
        <div class="font-mono text-xs">
          Not fully watched: ({newParams.fullyWatched.no}) = {newParams
            .fullyWatched.no}
        </div>
      </div>
      <div class="flex flex-col space-y-1 pt-3">
        <div>
          Score change when a minute has passed (counted from upload time):
        </div>
        <div class="font-mono text-xs">Formula: (score) ± (minute-change)</div>
        <div class="flex items-start space-x-4">
          <label class="flex flex-col">
            <span>Score change when a minute passes:</span>
            <input bind:value={newParams.minutePassed} type="number" />
          </label>
        </div>
        <div class="text-xs">Change in score:</div>
        <div class="font-mono text-xs">
          When a minute passes: ({newParams.minutePassed}) = {newParams.minutePassed}
        </div>
      </div>
      <div class="flex flex-col space-y-1 pt-3">
        <div>Score change on the basis of views/minute:</div>
        <div class="font-mono text-xs">
          Formula: (score) ± ( (v/m)/(divisor) > (threshold) ? (greaterThan) :
          (lessThan) )
        </div>
        <div class="flex items-start space-x-4">
          <label class="flex flex-col">
            <span>Divisor:</span>
            <input
              bind:value={newParams.viewsPerMinute.divisor}
              type="number" />
          </label>
          <label class="flex flex-col">
            <span>Threshold:</span>
            <input
              bind:value={newParams.viewsPerMinute.threshold}
              type="number" />
          </label>
        </div>
        <div class="flex items-start space-x-4">
          <label class="flex flex-col">
            <span>Greater-than change:</span>
            <input bind:value={newParams.viewsPerMinute.yes} type="number" />
          </label>
          <label class="flex flex-col">
            <span>Less-than change:</span>
            <input bind:value={newParams.viewsPerMinute.no} type="number" />
          </label>
        </div>
        <div class="text-xs">Change in score:</div>
        <div class="font-mono text-xs">Views Per Minute is 0: 0</div>
        <div class="font-mono text-xs">
          Views Per Minute is 5: ( 1 / {newParams.viewsPerMinute.divisor} > {newParams
            .viewsPerMinute.threshold} ? ( {newParams.viewsPerMinute.yes} : {newParams
            .viewsPerMinute.no} ) ) = {Number(
            1 / newParams.viewsPerMinute.divisor >
              newParams.viewsPerMinute.threshold
              ? newParams.viewsPerMinute.yes
              : newParams.viewsPerMinute.no,
          )}
        </div>
        <div class="font-mono text-xs">
          Views Per Minute is 11: ( 11 / {newParams.viewsPerMinute.divisor} > {newParams
            .viewsPerMinute.threshold} ? ( {newParams.viewsPerMinute.yes} : {newParams
            .viewsPerMinute.no} ) ) = {11 / newParams.viewsPerMinute.divisor >
          newParams.viewsPerMinute.threshold
            ? newParams.viewsPerMinute.yes
            : newParams.viewsPerMinute.no}
        </div>
        <div class="font-mono text-xs">
          Views Per Minute is 20: ( 20 / {newParams.viewsPerMinute.divisor} > {newParams
            .viewsPerMinute.threshold} ? ( {newParams.viewsPerMinute.yes} : {newParams
            .viewsPerMinute.no} ) ) = {20 / newParams.viewsPerMinute.divisor >
          newParams.viewsPerMinute.threshold
            ? newParams.viewsPerMinute.yes
            : newParams.viewsPerMinute.no}
        </div>
        <div class="pt-4">
          <Button on:click={sendConfigData} disabled={loading}>
            {#if loading}
              Creating config ...
            {:else}
              Create new config
            {/if}
          </Button>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
input {
  background: rgb(255, 255, 255, 0.09);
  border-radius: 8px;
}

span {
  font-size: 12px;
  color: rgb(255, 255, 255, 0.8);
}
</style>
