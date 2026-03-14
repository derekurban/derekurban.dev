<script lang="ts">
	import type { Project } from '$lib/types/project';
	import type { TransitionConfig } from 'svelte/transition';
	import ProjectCard from './ProjectCard.svelte';
	import { crossfade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { flip } from 'svelte/animate';
	import { onMount } from 'svelte';

	interface Props {
		filteredProjects: Project[];
	}

	let { filteredProjects }: Props = $props();

	let initialRevealDone = $state(false);

	onMount(() => {
		setTimeout(() => {
			initialRevealDone = true;
		}, 800);
	});

	const [sendCrossfade, receiveCrossfade] = crossfade({
		duration: 350,
		easing: cubicOut,
		fallback(node) {
			const style = getComputedStyle(node);
			const opacity = +style.opacity;
			return {
				duration: 350,
				easing: cubicOut,
				css: (t) => `
					opacity: ${t * opacity};
					transform: scale(${0.92 + 0.08 * t}) translateY(${12 * (1 - t)}px);
				`
			};
		}
	});

	function send(node: Element, params: { key: string }): TransitionConfig {
		if (!initialRevealDone) return { duration: 0 };
		return sendCrossfade(node, params)();
	}

	function receive(node: Element, params: { key: string }): TransitionConfig {
		if (!initialRevealDone) return { duration: 0 };
		return receiveCrossfade(node, params)();
	}
</script>

<div class="bento">
	{#each filteredProjects as project, i (project.slug)}
		<div
			class="card-wrapper"
			in:receive={{ key: project.slug }}
			out:send={{ key: project.slug }}
			animate:flip={{ duration: 350, easing: cubicOut }}
		>
			<ProjectCard
				{project}
				index={i}
				href="/projects/{project.slug}"
				skipReveal={initialRevealDone}
			/>
		</div>
	{/each}

	{#if filteredProjects.length === 0}
		<p class="empty-state">No projects match the selected tags.</p>
	{/if}
</div>

<style>
	.bento {
		max-width: 1280px;
		margin: 0 auto;
		padding: 0 2rem 5rem;
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1.25rem;
		align-items: stretch;
	}

	.card-wrapper {
		position: relative;
		min-height: 412px;
	}

	.empty-state {
		grid-column: 1 / -1;
		text-align: center;
		padding: 3rem 1rem;
		font-family: var(--font-body);
		font-size: 0.95rem;
		color: var(--color-medium);
		font-weight: 400;
	}

	@media (max-width: 1100px) {
		.bento {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 700px) {
		.bento {
			grid-template-columns: 1fr;
			grid-auto-rows: auto;
			padding-left: 1rem;
			padding-right: 1rem;
		}

		.card-wrapper,
		.card-wrapper {
			min-height: 392px;
		}
	}
</style>
