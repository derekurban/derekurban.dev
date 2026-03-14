<script lang="ts">
	import '../app.css';
	import '@fontsource/newsreader/400.css';
	import '@fontsource/newsreader/500.css';
	import '@fontsource/newsreader/600.css';
	import '@fontsource/dm-sans/400.css';
	import '@fontsource/dm-sans/500.css';
	import '@fontsource/dm-sans/600.css';
	import '@fontsource/space-mono/400.css';
	import '@fontsource/space-mono/700.css';

	import { afterNavigate, onNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import DotBackground from '$lib/components/DotBackground.svelte';

	let { children } = $props();

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	afterNavigate(({ to, from, type }) => {
		if (
			type === 'link' &&
			to?.url.pathname.startsWith('/projects/') &&
			to.url.pathname !== from?.url.pathname
		) {
			requestAnimationFrame(() => {
				window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
			});
		}
	});
</script>

<svelte:head>
	<script>
		const storedTheme = localStorage.getItem('theme');
		if (storedTheme === 'light' || storedTheme === 'dark') {
			document.documentElement.dataset.theme = storedTheme;
		}
	</script>
</svelte:head>

<DotBackground />
<div class="relative z-1">
	<Nav />
	{@render children()}
	<Footer />
</div>
