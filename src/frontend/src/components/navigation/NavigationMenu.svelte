<script lang="ts">
import HamburgerButton from './HamburgerButton.svelte';
import Navbar from './Navbar.svelte';

let menuOpen: boolean = false;
</script>

<HamburgerButton bind:menuOpen />
{#if menuOpen}
	<Navbar bind:menuOpen />
{/if}
