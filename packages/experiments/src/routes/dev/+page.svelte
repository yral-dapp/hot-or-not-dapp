<script lang="ts">
import Button from '$components/button/Button.svelte'
import { getDb } from '$lib/db'
import type { ViewChangeParameters } from '$lib/db/db.types'
import { isDev } from '$lib/db/dev'
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore'
import { onMount } from 'svelte'

let allowed = false
let currentParams: ViewChangeParameters | undefined = undefined
let newParams: Omit<ViewChangeParameters, 'created_at' | 'created_by'> = {
  liked: {
    yes: 0,
    no: 1,
  },
  unliked: {
    yes: -1,
    no: 0,
  },
  shared: {
    yes: 1,
    no: -1,
  },
  watched: {
    minPercentage: 25,
    multiplier: 0.5,
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
  minutePassed: 1,
  viewsPerMinute: {
    divideBy: 10,
    greaterThan: 1,
    yes: 0.5,
    no: -0.2,
  },
}

async function checkIfAllowed() {
  const req = await isDev()
  console.log({ req })
  allowed = req.ok
  if (allowed) {
    fetchCurrentParams()
  }
}

async function fetchCurrentParams() {
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
  <div class="text-white">
    <div class="border border-white/50 p-4">
      <div>Current view params:</div>
      {#if currentParams}
        <div></div>
      {:else}
        <div>No config found</div>
      {/if}
    </div>

    <div class="flex flex-col">
      <div class="flex items-start space-x-4">
        <label class="flex flex-col">
          <span>If video is liked:</span>
          <input type="number" />
        </label>
        <label class="flex flex-col">
          <span>If video is not liked:</span>
          <input type="number" />
        </label>
      </div>
      <div class="flex items-start space-x-4">
        <label class="flex flex-col">
          <span>If video is unliked:</span>
          <input type="number" />
        </label>
        <label class="flex flex-col">
          <span>If video is not unliked:</span>
          <input type="number" />
        </label>
      </div>
      <div class="flex items-start space-x-4">
        <label class="flex flex-col">
          <span>If video is shared:</span>
          <input type="number" />
        </label>
        <label class="flex flex-col">
          <span>If video is not shared:</span>
          <input type="number" />
        </label>
      </div>
      <div class="flex items-start space-x-4">
        <label class="flex flex-col">
          <span>If video is watched minimum of percentage:</span>
          <input type="number" />
        </label>
        <label class="flex flex-col">
          <span>Then change multiplier becomes:</span>
          <input type="number" />
        </label>
      </div>
      <div>Formula for watched is: minPercentage * multiplier</div>
      <div class="flex items-start space-x-4">
        <label class="flex flex-col">
          <span>If video is watched minimum of percentage:</span>
          <input type="number" />
        </label>
        <label class="flex flex-col">
          <span>Change above threshold:</span>
          <input type="number" />
        </label>
        <label class="flex flex-col">
          <span>Change below threshold:</span>
          <input type="number" />
        </label>
      </div>
      <div class="flex items-start space-x-4">
        <label class="flex flex-col">
          <span>If video is watched fully:</span>
          <input type="number" />
        </label>
        <label class="flex flex-col">
          <span>If video is not watched fully:</span>
          <input type="number" />
        </label>
      </div>
      <label class="flex flex-col">
        <span>Change in score when a minute passes:</span>
        <input type="number" />
      </label>
      <div class="flex flex-col space-y-4">
        <div>Views per minute formula:</div>
        <div>score / divideBy > greaterThan</div>
        <label class="flex flex-col">
          <span>If video is watched fully:</span>
          <input type="number" />
        </label>
        <label class="flex flex-col">
          <span>If video is not watched fully:</span>
          <input type="number" />
        </label>
        <label class="flex flex-col">
          <span>If greater than (greaterThan) value:</span>
          <input type="number" />
        </label>
        <label class="flex flex-col">
          <span>If less than (greaterThan) value:</span>
          <input type="number" />
        </label>
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
  font-size: 14px;
  color: rgb(255, 255, 255, 0.8);
}
</style>
