<script lang="ts" context="module">
export const toggleChatWidgetVisibility = (show?: boolean) => {
	if (show !== undefined) {
		(window as any)?._gs('set', 'chat', show ? 'show' : 'hide');
	} else {
		const shown = (window as any)?._gs('get', 'chat')?.button;
		(window as any)?._gs('set', 'chat', { button: !shown ? 'show' : 'hide' });
	}
};
</script>

<svelte:head>
	<script>
	!(function (g, s, q, r, d) {
		r = g[r] =
			g[r] ||
			function () {
				(r.q = r.q || []).push(arguments);
			};
		d = s.createElement(q);
		d.src = '//d1l6p2sc9645hc.cloudfront.net/gosquared.js';
		q = s.getElementsByTagName(q)[0];
		q.parentNode.insertBefore(d, q);
	})(window, document, 'script', '_gs');

	_gs('GSN-745719-F');
	_gs('set', 'anonymizeIP', true);
	_gs('set', 'chat', { button: false });
	</script>
</svelte:head>
