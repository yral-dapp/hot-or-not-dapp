<script lang="ts">
import HomeLayout from '$components/layout/HomeLayout.svelte'
import BottomNavigation from '$components/navigation/BottomNavigation.svelte'
import IconButton from '$components/button/IconButton.svelte'
import Icon from '$components/icon/Icon.svelte'
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
      <IconButton>
        <Icon name="caret-left" class="h-5 w-5" />
      </IconButton>
    </div>
  </svelte:fragment>
  <svelte:fragment slot="content">content</svelte:fragment>
  <div class="w-full" slot="bottom-navigation">
    <BottomNavigation />
  </div>
</HomeLayout>
