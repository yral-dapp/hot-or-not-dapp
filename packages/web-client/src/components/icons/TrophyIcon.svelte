<script lang="ts">
export { exportClass as class };
let exportClass: any = '';
export let filled = false;
</script>

{#if filled}
	<svg class="{exportClass}" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M0 4C0 3.44772 0.447715 3 1 3H2V11C0.895431 11 0 10.1046 0 9V4Z" fill="#E96B25"></path>
		<path d="M21 4C21 3.44772 20.5523 3 20 3H19V11C20.1046 11 21 10.1046 21 9V4Z" fill="#E96B25"
		></path>
		<path
			d="M3 1.875C3 0.839466 3.83947 0 4.875 0H16.125C17.1605 0 18 0.839466 18 1.875V7.5C18 11.6421 14.6421 15 10.5 15C6.35786 15 3 11.6421 3 7.5V1.875Z"
			fill="#E96B25"></path>
		<path
			d="M5 19.6667C5 20.403 5.59695 21 6.33333 21H14.6667C15.403 21 16 20.403 16 19.6667C16 18.1939 14.8061 17 13.3333 17H7.66667C6.19391 17 5 18.1939 5 19.6667Z"
			fill="#E96B25"></path>
		<rect width="2" height="4" transform="matrix(1 0 0 -1 9 17)" fill="#E96B25"></rect>
	</svg>
{:else}
	<svg class="{exportClass}" viewBox="0 0 23 21" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M18 2H21C21.5523 2 22 2.44772 22 3V5C22 7.76142 19.7614 10 17 10V10"
			stroke="currentColor"
			stroke-width="1.5"></path>
		<path
			d="M5 2H2C1.44772 2 1 2.44772 1 3V5C1 7.76142 3.23858 10 6 10V10"
			stroke="currentColor"
			stroke-width="1.5"></path>
		<path
			d="M4.75 1.875C4.75 1.25368 5.25368 0.75 5.875 0.75H17.125C17.7463 0.75 18.25 1.25368 18.25 1.875V7.5C18.25 11.2279 15.2279 14.25 11.5 14.25C7.77208 14.25 4.75 11.2279 4.75 7.5V1.875Z"
			stroke="currentColor"
			stroke-width="1.5"></path>
		<path
			d="M6.75 19.6667C6.75 19.9888 7.01117 20.25 7.33333 20.25H15.6667C15.9888 20.25 16.25 19.9888 16.25 19.6667C16.25 18.6081 15.3919 17.75 14.3333 17.75H8.66667C7.60812 17.75 6.75 18.6081 6.75 19.6667Z"
			stroke="currentColor"
			stroke-width="1.5"></path>
		<rect width="2" height="3" transform="matrix(1 0 0 -1 11 17)" fill="currentColor"></rect>
	</svg>
{/if}
