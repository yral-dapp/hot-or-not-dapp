<script lang="ts">
import { onMount } from 'svelte';

export let element: HTMLElement;
export let paginationListLength: number = 4;
export let nthItemToWatchFromEndForDataRefresh: number = 2;
export let observerThreshold: number = 0.5;
export let dataLoadingFunction: () => Promise<void>;
export let fetchedEntriesLength: number;
export let reachedEndOfList: boolean;

const selectListElementAndWatch = async (observer: IntersectionObserver) => {
	try {
		console.log('selecting');
		if (element) {
			const nthLastListItemToWatch =
				element.children[element.children.length - nthItemToWatchFromEndForDataRefresh];

			console.log('nthlast', nthLastListItemToWatch);

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
			console.log('in observe	', entries);
			if (entries[0].isIntersecting) {
				console.log('intersecting');
				if (fetchedEntriesLength < paginationListLength) {
					console.log('disconnecting');
					observer.disconnect();
					reachedEndOfList = true;
					return;
				}

				await dataLoadingFunction();
				if (fetchedEntriesLength > nthItemToWatchFromEndForDataRefresh) {
					await selectListElementAndWatch(observer);
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
