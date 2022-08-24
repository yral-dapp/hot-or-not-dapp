<script lang="ts">
import Camera from '$components/upload/Camera.svelte';
import Upload from '$components/upload/Upload.svelte';

let file: File | Blob | null = null;
</script>

{#if file === null}
	<Camera bind:selectedFile="{file}" />
{:else}
	<Upload bind:selectedFile="{file}" />
{/if}
