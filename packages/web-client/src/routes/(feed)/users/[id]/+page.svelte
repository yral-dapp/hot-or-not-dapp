<script lang="ts">
import HomeLayout from '@hnn/components/web-client/layout/HomeLayout.svelte'
import BottomNavigation from '@hnn/components/web-client/navigation/BottomNavigation.svelte'
import IconButton from '@hnn/components/button/IconButton.svelte'

import { page } from '$app/stores'
import { playerState } from '$lib/stores/playerState'
</script>

<svelte:head>
  <title>User's Videos | Hot or Not</title>
</svelte:head>

<HomeLayout>
  <svelte:fragment slot="top">
    <div class="flex items-center rounded-full bg-black/10 px-4 py-2">
      User's Videos
    </div>
    <div class="absolute left-4 top-4">
      <IconButton iconName="caret-left" iconClass="h-5 w-5" />
    </div>
  </svelte:fragment>
  <svelte:fragment slot="content">content</svelte:fragment>
  <div class="w-full" slot="bottom-navigation">
    <BottomNavigation
      feedUrl={$playerState.currentFeedUrl == 'no-videos'
        ? ''
        : $playerState.currentFeedUrl}
      pathName={$page.url.pathname} />
  </div>
</HomeLayout>
