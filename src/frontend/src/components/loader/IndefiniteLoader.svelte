<script lang="ts">
import { fade } from 'svelte/transition';
</script>

<div class="wrapper" transition:fade>
	<div class="progressbar"></div>
</div>

<style>
.progressbar {
	display: block;
	position: fixed;
	z-index: 2;
	bottom: 0;
	width: 100%;
	height: 16px;
}
.progressbar::before,
.progressbar::after {
	content: '';
	/* display: block; */
	position: absolute;
	/* z-index: 99; */
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	/* border-radius: 15px; */
	background-image: linear-gradient(
		90deg,
		#e91e63 0%,
		#e91e63 20%,
		#03a9f4 20%,
		#03a9f4 40%,
		#ff5722 40%,
		#ff5722 60%,
		#ffeb3b 60%,
		#ffeb3b 80%,
		#8bc34a 80%,
		#8bc34a 100%
	);
	/* background-position: 0 0; */
	/* background-repeat: repeat-x; */
	/* -webkit-animation: movebar 5s linear infinite; */
	animation: movebar 8s linear infinite;
}
.progressbar::before {
	box-shadow: 0 -0.5rem 0.75rem 0 rgba(0, 0, 0, 0.1);
}
.progressbar::after {
	z-index: 9;
	top: 6px;
	filter: blur(16px);
	opacity: 0.7;
}
/* @-webkit-keyframes movebar {
    from {
      background-position: 0 0;
    }
    to {
      background-position: 100vw 0;
    }
  } */
@keyframes movebar {
	from {
		background-position: 0 0;
	}
	to {
		background-position: 100vw 0;
	}
}
</style>
