<script lang="ts">
import AirdropForm from '$components/airdrop-form/AirdropForm.svelte'
import IconButton from '$components/button/IconButton.svelte'
import HomeLayout from '$components/layout/HomeLayout.svelte'
import goBack from '$lib/utils/goBack'
import { navigateBack } from '$stores/navigation'
</script>

<svelte:head>
  <title>Airdrop | Hot or Not</title>
</svelte:head>

<HomeLayout>
  <svelte:fragment slot="top">
    <div
      class="flex w-full items-center justify-center bg-black py-4 shadow-xl shadow-black/50">
      Airdrop Claim Form
      <div class="absolute left-4 top-4">
        <IconButton
          iconName="caret-left"
          iconClass="h-7 w-7"
          on:click={() => goBack($navigateBack || '/menu', true)}
          class="shrink-0" />
      </div>
    </div>
  </svelte:fragment>
  <div class="h-full w-full overflow-y-auto" slot="content">
    <AirdropForm />
  </div>
</HomeLayout>
