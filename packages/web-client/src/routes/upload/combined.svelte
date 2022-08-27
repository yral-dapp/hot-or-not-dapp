<script lang="ts">
import Camera from '$components/upload/Camera.svelte';
import Upload from '$components/upload/Upload.svelte';
import { fileBlob, fileList } from '$stores/fileUpload';
</script>

{#if !fileList || !fileBlob}
	<Camera />
{:else}
	<Upload />
{/if}
