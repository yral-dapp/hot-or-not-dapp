<script lang="ts">
import Button from '../button/Button.svelte'
import Popup from './Popup.svelte'
import type { PostReportData, ProfileReportData } from './ReportPopup.types'
import { createEventDispatcher } from 'svelte'

export let show = false
export let type: 'post' | 'profile'
export let reportData: PostReportData | ProfileReportData

let loading = false
let selectedReason = ''

const dispatch = createEventDispatcher<{
  close: void
  report: {
    type: 'post' | 'profile'
    selectedReason: string
    data: PostReportData | ProfileReportData
  }
}>()

function confirmReport() {
  if (selectedReason) {
    dispatch('report', {
      type,
      selectedReason: selectedReason,
      data: reportData,
    })
    show = false
  }
}
</script>

<Popup on:close showCloseButton bind:show>
  <div class="flex flex-col space-y-4">
    <div class="text-md pb-2 text-center text-black">Report {type}</div>
    <div class="text-md pb-2 text-center text-black">
      Please select a reason why you are reporting this {type}
    </div>
    <select
      class="rounded-sm border-0 text-black disabled:text-black/50"
      bind:value={selectedReason}>
      <option value="" disabled selected>Click a reason</option>
      <option value="nudity">Nudity/Porn</option>
      <option value="violence">Violence/Gore</option>
      <option value="offensive">Offensive</option>
      <option value="spam">Spam/Ad</option>
      <option value="others">Others</option>
    </select>
    <Button
      on:click={confirmReport}
      disabled={loading || !selectedReason}
      type="primary">
      Report
    </Button>
  </div>
</Popup>
