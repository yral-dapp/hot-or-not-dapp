<script lang="ts">
import IconButton from '$components/button/IconButton.svelte';
import CloseIcon from '$components/icons/CloseIcon.svelte';
import { onMount } from 'svelte';

export let value = '';
export let placeholder = '';
export let maxHashtags = -1;
export let tags: string[] = [];

let _tags = new Set<string>();

function createTag() {
	const val = value.replace('#', '').replace(',', '').replaceAll(' ', '').toLowerCase();
	value = '';
	_tags.add(val);
	tags = Array.from(_tags);
}

function handleInput(e: KeyboardEvent) {
	if (
		e.key === 'Unidentified' &&
		value.trim() &&
		(value.indexOf(' ') > -1 || value.indexOf(',') > -1)
	) {
		createTag();
	} else {
		if (value.trim() && (e.key === ',' || e.key === ' ')) {
			createTag();
		} else if (value == '' && e.key == 'Backspace' && tags.length > 0) {
			tags.pop();
			tags = tags;
		}
	}
}

function removeTag(tag: string) {
	const index = tags.indexOf(tag);
	if (index > -1) {
		tags.splice(index, 1);
		_tags.delete(tag);
		tags = tags;
	}
}

$: showError = maxHashtags > 0 && tags.length >= maxHashtags;

onMount(() => {
	tags = value
		.split(/(?:,| )+/)
		.filter((o) => !!o)
		.map((o) => o.replace('#', '').toLowerCase());
});
</script>

<tags-input
	class="relative inline-flex w-full flex-wrap items-center gap-3 rounded-xl bg-white/10 p-3">
	{#each tags as tag}
		<div class="flex shrink-0 items-center space-x-2 rounded-sm bg-primary py-1 px-2 text-sm">
			<span>
				#{tag}
			</span>
			<IconButton on:click="{() => removeTag(tag)}">
				<CloseIcon class="h-4 w-4" />
			</IconButton>
		</div>
	{/each}
	{#if showError}
		<span class="absolute -bottom-6 text-sm text-red-600">Max hashtags number reached</span>
	{:else}
		<input
			type="text"
			bind:value
			on:keyup="{handleInput}"
			placeholder="{placeholder}"
			style="min-width: 30%;"
			class="flex-1 border-0 bg-transparent py-[2px] px-0 outline-none ring-0 focus:border-0 focus:outline-none focus:ring-0" />
	{/if}
</tags-input>
