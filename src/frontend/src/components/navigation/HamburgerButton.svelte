<script lang="ts">
export let menuOpen: boolean = false;
</script>

<button
	class="fixed bottom-8 right-8 z-10 h-12 w-12 rounded-lg bg-red-500 shadow-lg focus:outline-none focus:ring focus:ring-red-300 active:bg-red-600"
	on:click="{() => (menuOpen = !menuOpen)}"
>
	<div class:open="{menuOpen}">
		<span></span>
		<span></span>
		<span></span>
	</div>
</button>

<style>
button > div {
	width: 60%;
	height: 100%;
	position: relative;
	transform: rotate(0deg);
	cursor: pointer;
	margin: auto;
}

button > div > span {
	display: block;
	position: absolute;
	height: 10%;
	width: 100%;
	background: white;
	border-radius: 10%;
	opacity: 1;
	left: 0;
	transform: rotate(0deg);
	transform: translateY(-50%);
	transition: transform 0.5s ease-in-out, top 0.5s ease-in-out, opacity 0.5s ease-in-out;
	will-change: transform, top, opacity;
}

button > div > span:nth-child(1) {
	top: 25%;
}

button > div > span:nth-child(2) {
	top: 50%;
}

button > div > span:nth-child(3) {
	top: 75%;
}

button > div.open > span:nth-child(1) {
	top: 45%;
	transform: translateY(-50%);
	transform: rotate(135deg);
}

button > div.open > span:nth-child(2) {
	transform: translateX(-200%);
	opacity: 0;
}

button > div.open > span:nth-child(3) {
	top: 45%;
	transform: translateY(-50%);
	transform: rotate(-135deg);
}
</style>
