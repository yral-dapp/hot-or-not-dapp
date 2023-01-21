<script lang="ts">
import { createEventDispatcher, onMount } from 'svelte';

export let threshold: number = 0.5;
export let intersect: boolean;
export let disabled: boolean;

const dispatch = createEventDispatcher<{
	intersected: void;
}>();

let observer: IntersectionObserver;
let intersectionWrapperEl: HTMLElement;

function selectListElementAndWatch() {
	try {
		const el = intersectionWrapperEl.children[0];
		if (el) {
			observer.observe(el);
		}
	} catch (error) {
		console.error(error);
	}
}

function initIntersectionObserver() {
	observer = new IntersectionObserver(
		async (entries) => {
			if (entries[0].isIntersecting) {
				if (!intersect) {
					observer.disconnect();
				} else if (!disabled) {
					dispatch('intersected');
				}
			}
		},
		{ threshold }
	);
}

onMount(() => {
	initIntersectionObserver();
	selectListElementAndWatch();
});
</script>

<intersection-observer bind:this="{intersectionWrapperEl}">
	<slot />
</intersection-observer>
