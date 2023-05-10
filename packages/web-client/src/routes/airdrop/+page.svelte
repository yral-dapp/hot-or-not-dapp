<script lang="ts">
import AirdropForm from '$components/airdrop-form/AirdropForm.svelte'
import IconButton from '$components/button/IconButton.svelte'
import CaretLeftIcon from '$components/icons/CaretLeftIcon.svelte'
import HomeLayout from '$components/layout/HomeLayout.svelte'
import goBack from '$lib/utils/goBack'
import { navigateBack } from '$stores/navigation'

let participated = false
</script>

<svelte:head>
  <title>Airdrop | Hot or Not</title>
</svelte:head>

<HomeLayout>
  <svelte:fragment slot="top">
    <div
      class="flex w-full items-center justify-center bg-black py-4 shadow-xl shadow-black/50">
      Airdrop
      <div class="absolute left-4 top-4">
        <IconButton
          on:click={() => goBack($navigateBack || '/menu', true)}
          class="shrink-0">
          <CaretLeftIcon class="h-7 w-7" />
        </IconButton>
      </div>
    </div>
  </svelte:fragment>
  <svelte:fragment slot="content">
    <div class="h-full w-full overflow-y-auto px-2 py-24">
      <AirdropForm bind:participated />
    </div>
  </svelte:fragment>
</HomeLayout>
