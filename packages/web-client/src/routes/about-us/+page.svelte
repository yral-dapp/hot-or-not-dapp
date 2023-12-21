<script lang="ts">
import IconButton from '$lib/components/button/IconButton.svelte'
import Icon from '$lib/components/icon/Icon.svelte'
import HomeLayout from '$lib/components/layout/HomeLayout.svelte'
</script>

<svelte:head>
  <title>About Us | Hot or Not</title>
</svelte:head>

<HomeLayout>
  <svelte:fragment slot="top">
    <div
      class="flex w-full items-center justify-center bg-black py-4 shadow-xl shadow-black/50">
      About Us
      <div class="absolute left-4 top-4">
        <IconButton iconName="caret-left" iconClass="h-5 w-5" href="/menu" />
      </div>
    </div>
  </svelte:fragment>
  <svelte:fragment slot="content">
    <div
      class="my-32 flex h-full w-full flex-col space-y-16 overflow-hidden overflow-y-auto px-8">
      <div class="font-bold text-primary">
        Reinventing Short Video Social Media
      </div>
      <div class="flex flex-col space-y-2">
        <div class="font-bold">Think TikTok on Blockchain</div>
        <div class="font-light">
          Hot or Not is a short-video social media platform on blockchain, which
          not only provides the fun and excitement of social media but also
          enables the users to earn rewards for creating content, engaging with
          it or sharing it with their friends and family!
        </div>
      </div>
    </div>
  </svelte:fragment>
</HomeLayout>
