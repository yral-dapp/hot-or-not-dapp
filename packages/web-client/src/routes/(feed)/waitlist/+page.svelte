<script lang="ts">
import Button from '$components/button/Button.svelte'
import { handleParams } from '$lib/utils/params'
import { onMount } from 'svelte'

onMount(() => {
  handleParams()
})
</script>

<svelte:head>
  <title>Waitlist | Hot or Not</title>
</svelte:head>

<div
  class="absolute flex h-full w-full flex-col items-center gap-8 overflow-hidden overflow-y-scroll px-12 pt-16 pb-32">
  <div class="flex flex-col items-center gap-4">
    <div class="text-3xl font-bold">Logins paused</div>
    <div class="text-center opacity-70">
      Due to sudden high demand, new user registrations are temporarily closed.
      You can continue to browse the platform's hundreds of videos while we
      implement the global timer and resume logins! Thank you for bearing with
      us.
    </div>
  </div>

  <Button href="/">Continue browsing</Button>

  <div class="text-center">Register to get notified when logins resume</div>

  <iframe
    class="h-[36rem] w-full shrink-0"
    title="Waitlist Form"
    src="https://docs.google.com/forms/d/e/1FAIpQLScb7VqGcptH3-_42ord-o7KfilvIF2r69mbjgBq5QQKkxWzMw/viewform?embedded=true"
    frameborder="0"
    marginheight="0"
    marginwidth="0">
    Loading…
  </iframe>
</div>
