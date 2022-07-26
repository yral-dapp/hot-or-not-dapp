<script lang="ts">
import { INFINITE_SCROLLER_PAGINATION_DEFAULT_SIZE } from '$lib/constants';
import { onMount } from 'svelte';

export let ulElementSelectorString: string;
export let paginationListLength: number = INFINITE_SCROLLER_PAGINATION_DEFAULT_SIZE;
export let nthItemToWatchFromEndForDataRefresh: number = 6;
export let observerThreshold: number = 0.5;
export let dataLoadingFunction: () => Promise<void>;
export let fetchedEntriesLength: number;

export let reachedEndOfList: boolean;

const selectListElementAndWatch = (observer: IntersectionObserver) => {
	try {
		const ulElement: HTMLUListElement | null = document.querySelector(ulElementSelectorString);
		if (ulElement) {
			const nthLastListItemToWatch =
				ulElement.children[ulElement.children.length - nthItemToWatchFromEndForDataRefresh];

			if (!nthLastListItemToWatch) return;

			observer.observe(nthLastListItemToWatch);
		}
	} catch (error) {
		console.error(error);
	}
};

onMount(() => {
	const observer = new IntersectionObserver(
		async (entries) => {
			if (entries[0].isIntersecting) {
				if (fetchedEntriesLength < paginationListLength) {
					observer.disconnect();
					reachedEndOfList = true;
					return;
				}

				await dataLoadingFunction();
				if (fetchedEntriesLength > nthItemToWatchFromEndForDataRefresh) {
					selectListElementAndWatch(observer);
				}
			}
		},
		{ threshold: observerThreshold }
	);

	selectListElementAndWatch(observer);
});
</script>

<slot />
{#if reachedEndOfList}
	<slot name="ending">
		<!-- <p class="text-center text-2xl my-6">
      🥳 You've seen all there is to see on this page 🥳
    </p> -->
	</slot>
{/if}
