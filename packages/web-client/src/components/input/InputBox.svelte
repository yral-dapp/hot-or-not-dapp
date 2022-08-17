<script lang="ts">
export let disabled = false;
export let placeholder = '';
export let value: string | number = '';
export let cols: number = 20;
export let rows: number = 20;
export { exportClass as class };

let exportClass: any = '';
</script>

<textarea
	disabled="{disabled}"
	placeholder="{placeholder}"
	cols="{cols}"
	rows="{rows}"
	bind:value
	on:input
	on:change
	on:focus
	on:blur
	class="grow border-none bg-transparent py-3 px-4 focus:ring-transparent {exportClass}"></textarea>
