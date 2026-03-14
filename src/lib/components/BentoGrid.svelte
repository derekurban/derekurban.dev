<script lang="ts">
	import type { Project } from '$lib/types/project';
	import type { TransitionConfig } from 'svelte/transition';
	import ProjectCard from './ProjectCard.svelte';
	import { cubicOut, quartOut } from 'svelte/easing';
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

	function receive(node: Element): TransitionConfig {
		if (!initialRevealDone) return { duration: 0 };
		const style = getComputedStyle(node);
		const opacity = +style.opacity || 1;

		return {
			duration: 420,
			easing: quartOut,
			css: (t) => `
				opacity: ${t * opacity};
				transform: translateY(${10 * (1 - t)}px) scale(${0.982 + 0.018 * t});
			`
		};
	}

	function send(node: Element): TransitionConfig {
		if (!initialRevealDone) return { duration: 0 };
		const element = node as HTMLElement;
		const grid = element.parentElement as HTMLElement | null;

		if (grid) {
			const nodeRect = element.getBoundingClientRect();
			const gridRect = grid.getBoundingClientRect();

			element.style.position = 'absolute';
			element.style.left = `${nodeRect.left - gridRect.left}px`;
			element.style.top = `${nodeRect.top - gridRect.top}px`;
			element.style.width = `${nodeRect.width}px`;
			element.style.height = `${nodeRect.height}px`;
			element.style.zIndex = '3';
			element.style.pointerEvents = 'none';
		}

		return {
			duration: 260,
			easing: cubicOut,
			css: (t, u) => `
				opacity: ${t};
				transform: translateY(${10 * u}px) scale(${1 - 0.02 * u});
			`
		};
	}
</script>

<div class="bento">
	{#each filteredProjects as project, i (project.slug)}
		<div
			class="card-wrapper"
			in:receive
			out:send
			animate:flip={{ duration: 440, easing: quartOut }}
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
		position: relative;
	}

	.card-wrapper {
		position: relative;
		min-height: 412px;
		will-change: transform, opacity;
		z-index: 0;
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
