<script lang="ts">
import { goto } from '$app/navigation';
import { onMount } from 'svelte';

onMount(() => goto('/all?id=0'));
</script>
