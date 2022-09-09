<script lang="ts">
import Button from '$components/button/Button.svelte';

import IconButton from '$components/button/IconButton.svelte';
import CaretLeftIcon from '$components/icons/CaretLeftIcon.svelte';

import HomeLayout from '$components/layout/HomeLayout.svelte';
</script>

<HomeLayout>
	<svelte:fragment slot="top">
		<div class="flex w-full items-center justify-center bg-black py-4 shadow-xl shadow-black/50">
			About Us
			<div class="absolute top-4 left-4">
				<IconButton href="/menu">
					<CaretLeftIcon class="h-5 w-5" />
				</IconButton>
			</div>
		</div>
	</svelte:fragment>
	<svelte:fragment slot="content">
		<div class="my-32 flex h-full w-full flex-col space-y-16 overflow-hidden overflow-y-auto px-8">
			<div class="font-bold text-primary">Reinventing Short Video Social Media</div>
			<div class="flex flex-col space-y-2">
				<div class="font-bold">Think TikTok on Blockchain</div>
				<div class="font-light">
					GoBazzinga is a short-video social media platform on blockchain, which not only provides
					the fun and excitement of social media but also enables the users to earn rewards for
					creating content, engaging with it or sharing it with their friends and family!
				</div>
			</div>

			<Button href="https://gobazzinga.io" class="w-full">Visit the website</Button>
		</div></svelte:fragment
	>
</HomeLayout>
