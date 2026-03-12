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

	import { onNavigate } from '$app/navigation';
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
</script>

<DotBackground />
<div class="relative z-1">
	<Nav />
	{@render children()}
	<Footer />
</div>
