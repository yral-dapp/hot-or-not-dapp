<script lang="ts" context="module">
import type { autocompleteTypes } from './autocompleteTypes';
export type inputAutocomplete = typeof autocompleteTypes[number];
</script>

<script lang="ts">
import { onMount } from 'svelte';

export let autocomplete: inputAutocomplete = 'off';
export let disabled = false;
export let placeholder = '';
export let value: string | number = '';
export let type: 'text' | 'password' | 'number' | 'email' = 'text';
export { exportClass as class };

let exportClass: any = '';
let inputEl: HTMLInputElement;

onMount(() => {
	inputEl.type = type;
});
</script>

<input
	autocomplete="{autocomplete}"
	disabled="{disabled}"
	placeholder="{placeholder}"
	bind:value
	bind:this="{inputEl}"
	on:input
	on:change
	on:focus
	on:blur
	class="grow border-none bg-transparent py-3 px-4 focus:ring-transparent {exportClass}"
/>
