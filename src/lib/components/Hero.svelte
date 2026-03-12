<script lang="ts">
	import { LayoutGrid } from 'lucide-svelte';
</script>

<section
	class="relative flex min-h-[80vh] flex-col items-center justify-center px-8 pt-32 pb-12 text-center max-md:min-h-[65vh] max-md:px-6 max-md:pt-28 max-md:pb-8"
>
	<div
		class="mb-8 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-medium opacity-0"
		style="border-color: var(--color-line); border-width: var(--border-w); background: var(--glass); animation: fade-up 0.7s 0.15s var(--ease-out-expo) forwards;"
	>
		<LayoutGrid size={14} strokeWidth={1.8} />
		Portfolio &middot; 2026
	</div>
	<h1
		class="font-display mb-5 text-[clamp(3.2rem,7.5vw,6.75rem)] leading-[0.95] tracking-tight opacity-0"
		style="font-weight: 500; letter-spacing: -0.04em; animation: fade-up 0.8s 0.3s var(--ease-out-expo) forwards;"
	>
		Things I've<br />
		<span
			class="italic"
			style="color: var(--color-accent); font-weight: 400;"
		>
			Built
		</span>
	</h1>
	<p
		class="max-w-[440px] text-[1rem] leading-[1.75] text-medium opacity-0"
		style="animation: fade-up 0.8s 0.45s var(--ease-out-expo) forwards;"
	>
		A curated gallery of projects across university, personal, and professional work. Software,
		hardware, and everything between.
	</p>
	<div
		class="mt-10 h-0.5 w-10 opacity-0"
		style="background: var(--color-line-dark); animation: fade-up 0.8s 0.6s var(--ease-out-expo) forwards;"
	></div>
</section>
