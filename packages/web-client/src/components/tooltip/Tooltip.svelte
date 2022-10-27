<script lang="ts">
export let text = '';
export let position: 'left' | 'right' | 'middle';

const positionClass = {
	left: 'left-0',
	right: 'right-0',
	middle: ''
};

const caretClass = {
	right: 'left-3',
	left: 'right-3',
	middle: ''
};

let show = true;
</script>

<tooltip class="relative w-full bg-red-500">
	{#if show}
		<div
			class="absolute bottom-14 whitespace-nowrap rounded-md bg-white p-2 px-4 text-black {positionClass[
				position
			]}">
			{text}
		</div>
		<svg
			class="absolute bottom-12 {caretClass[position]}"
			width="16"
			height="14"
			viewBox="0 0 16 14"
			fill="none"
			xmlns="http://www.w3.org/2000/svg">
			<path
				d="M7.13397 13.5C7.51887 14.1667 8.48113 14.1667 8.86603 13.5L15.7942 1.5C16.1791 0.833334 15.698 0 14.9282 0H1.0718C0.301997 0 -0.179129 0.833333 0.205771 1.5L7.13397 13.5Z"
				fill="white"></path>
		</svg>
	{/if}
	<div role="presentation" on:click="{() => (show = !show)}">
		<slot />
	</div>
</tooltip>
