<script lang="ts">
import IconButton from '@hnn/components/button/IconButton.svelte'
import Icon from '@hnn/components/icon/Icon.svelte'
import Input from '@hnn/components/input/Input.svelte'
import HomeLayout from '@hnn/components/layout/HomeLayout.svelte'
import getDefaultImageUrl from '$lib/utils/getDefaultImageUrl'
import { generateRandomName } from '$lib/utils/randomUsername'

let walletId = ''
</script>

<HomeLayout>
  <svelte:fragment slot="top">
    <div
      class="flex w-full items-center justify-center bg-black py-4 shadow-xl shadow-black/50">
      Refer & Earn
      <div class="absolute left-4 top-4">
        <IconButton
          iconName="caret-left"
          iconClass="h-5 w-5"
          href="/wallet-staging" />
      </div>
    </div>
  </svelte:fragment>
  <svelte:fragment slot="content">
    <div
      class="flex h-full w-full flex-col items-center space-y-4 overflow-hidden overflow-y-scroll px-8 pb-20 pt-16">
      <div class="w-full pt-6">
        <Input
          bind:value={walletId}
          type="text"
          placeholder="Enter Wallet ID to send tokens"
          class="w-full rounded-md bg-white/10 py-4" />
      </div>
      {#if walletId}
        <div class="flex w-full items-center justify-between py-8 text-white">
          <div class="flex items-center space-x-4">
            <img
              src={getDefaultImageUrl('1')}
              alt="avatar"
              class="h-12 w-12 rounded-full object-cover" />
            <div class="flex flex-col items-start">
              <span>{generateRandomName('name', '1')}</span>
              <span class="text-sm text-white/50">10 Aug</span>
            </div>
          </div>
          <div
            class="h-4 w-4 rounded-full border-[1px] border-white/50 bg-transparent" />
        </div>
      {:else}
        <div
          class="flex h-full w-full flex-col items-center justify-center space-y-4 px-16">
          <Icon name="transactions-graphic" class="w-56" />
          <div class="text-lg">You have not made any transactions yet</div>
        </div>
      {/if}
    </div>
  </svelte:fragment>
</HomeLayout>
