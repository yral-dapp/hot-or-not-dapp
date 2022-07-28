<script lang="ts">
import Avatar from '$components/avatar/Avatar.svelte';
import Button from '$components/button/Button.svelte';
import IconButton from '$components/button/IconButton.svelte';
import CaretLeftIcon from '$components/icons/CaretLeftIcon.svelte';
import CloseIcon from '$components/icons/CloseIcon.svelte';
import CoinBagIcon from '$components/icons/CoinBagIcon.svelte';
import EyeIcon from '$components/icons/EyeIcon.svelte';
import FireIcon from '$components/icons/FireIcon.svelte';
import FlashIcon from '$components/icons/FlashIcon.svelte';
import FlipIcon from '$components/icons/FlipIcon.svelte';
import GiftBoxIcon from '$components/icons/GiftBoxIcon.svelte';
import HeartIcon from '$components/icons/HeartIcon.svelte';
import HomeIcon from '$components/icons/HomeIcon.svelte';
import MenuIcon from '$components/icons/MenuIcon.svelte';
import MusicIcon from '$components/icons/MusicIcon.svelte';
import NotificationIcon from '$components/icons/NotificationIcon.svelte';
import PlusIcon from '$components/icons/PlusIcon.svelte';
import ShareIcon from '$components/icons/ShareIcon.svelte';
import TimerIcon from '$components/icons/TimerIcon.svelte';
import WalletIcon from '$components/icons/WalletIcon.svelte';
import HomeLayout from '$components/layout/HomeLayout.svelte';

const imgSrc =
	'https://images.pexels.com/photos/3276046/pexels-photo-3276046.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';
</script>

<div
	class="flex h-full w-full flex-col items-start space-y-8 divide-y-4 divide-white/10 overflow-scroll px-8 text-white"
>
	<!-- Avatar -->
	<div class="flex flex-col space-y-4 py-4">
		<span class="text-xl">Avatar</span>
		<div class="flex items-center space-x-4">
			<Avatar src="{imgSrc}" class="h-24 w-24" />
			<Avatar src="{imgSrc}" class="h-16 w-16" />
			<Avatar src="{imgSrc}" class="h-8 w-8" />
			<Avatar src="{imgSrc}" class="h-4 w-4" />
		</div>
	</div>

	<!-- Button -->
	<div class="flex flex-col space-y-4 py-4">
		<span class="text-xl">Button</span>
		<div class="flex flex-col space-y-2">
			<Button type="primary">Primary</Button>
			<Button type="secondary">Secondary</Button>
			<Button type="primary" disabled>Primary disabled</Button>
			<Button type="secondary" disabled>Secondary disabled</Button>
			<Button type="primary" href="#">Href type</Button>
		</div>
	</div>

	<!-- IconButton -->
	<div class="flex flex-col space-y-4 py-4">
		<span class="text-xl">Icon Button</span>
		<div class="flex flex-col space-y-2">
			<IconButton class="h-10 w-10 bg-primary">
				<CloseIcon class="h-6 w-6" />
			</IconButton>
		</div>
	</div>

	<!-- Icons -->
	<div class="flex flex-col space-y-4 py-4">
		<span class="text-xl">Icons</span>
		<div class="grid w-full grid-cols-4 gap-6">
			<CaretLeftIcon class="h-6 w-6" />
			<CloseIcon class="h-6 w-6" />
			<CoinBagIcon class="h-6 w-6" />
			<EyeIcon class="h-6 w-6" />
			<FireIcon class="h-6 w-6" />
			<FlashIcon class="h-6 w-6" />
			<FlipIcon class="h-6 w-6" />
			<GiftBoxIcon class="h-6 w-6" />
			<HeartIcon class="h-6 w-6" />
			<HomeIcon class="h-6 w-6" />
			<MenuIcon class="h-6 w-6" />
			<MusicIcon class="h-6 w-6" />
			<NotificationIcon class="h-6 w-6" />
			<NotificationIcon showDot class="h-6 w-6" />
			<PlusIcon class="h-6 w-6" />
			<ShareIcon class="h-6 w-6" />
			<TimerIcon class="h-6 w-6" />
			<WalletIcon class="h-6 w-6" />
		</div>
	</div>

	<!-- HomeLayout -->
	<div class="flex w-full flex-col space-y-4 py-4">
		<span class="text-xl">Home Layout</span>
		<div class="relative h-screen w-full border-2 border-dashed border-white/20">
			<HomeLayout testMode>
				<div slot="top">All videos</div>
				<div slot="bottom-navigation">Navigation</div>
				<div class="pointer-events-auto flex space-x-3" slot="bottom-description">Description</div>
				<div class="flex flex-col space-y-4" slot="bottom-right-controls">Controls</div>
			</HomeLayout>
		</div>
	</div>
</div>
