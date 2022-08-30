<script lang="ts">
import Camera from '$components/upload/Camera.svelte';
import Upload from '$components/upload/Upload.svelte';
import { fileToUpload } from '$stores/fileUpload';
</script>

{#if !fileToUpload}
	<Camera />
{:else}
	<Upload />
{/if}
