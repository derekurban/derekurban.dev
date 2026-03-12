<script lang="ts">
	import type { Project } from '$lib/types/project';
	import { reveal } from '$lib/actions/reveal';
	import { ArrowUpRight, FolderGit2 } from 'lucide-svelte';

	interface Props {
		project: Project;
		index: number;
		href: string;
		skipReveal?: boolean;
	}

	let { project, index, href, skipReveal = false }: Props = $props();

	let originClass = $derived(
		project.origin === 'Personal'
			? 'tag-personal'
			: project.origin === 'University'
				? 'tag-university'
				: 'tag-professional'
	);

	let statusClass = $derived(
		project.status === 'Complete'
			? 'tag-complete'
			: project.status === 'In Progress'
				? 'tag-progress'
				: 'tag-archived'
	);
</script>

<a
	class="bento-card"
	{href}
	use:reveal={{ delay: index * 75, skip: skipReveal }}
>
	<div class="card-gradient">
		<div class="card-gradient-bg" style="background: {project.gradient}"></div>
	</div>
	<div class="card-arrow">
		<ArrowUpRight size={14} strokeWidth={1.9} />
	</div>
	<div class="card-body">
		<div class="card-tag-row">
			<span class="card-tag {originClass}">{project.origin}</span>
			<span class="card-tag {statusClass}">{project.status}</span>
		</div>
		<h3 class="card-title">{project.title}</h3>
		<p class="card-desc">{project.desc}</p>
		<div class="card-tech">
			{#each project.tech as t}
				<span class="tech-pill">{t}</span>
			{/each}
		</div>
		{#if project.sourceUrl}
			<div class="card-source">
				<FolderGit2 class="card-source-icon" size={12} strokeWidth={1.8} />
				<span>Archived source</span>
			</div>
		{/if}
	</div>
</a>

<style>
	.bento-card {
		width: 100%;
		height: 100%;
		background: var(--color-warm-white);
		border: var(--border-w) solid var(--color-line);
		border-radius: var(--radius-card);
		overflow: hidden;
		cursor: pointer;
		position: relative;
		display: flex;
		flex-direction: column;
		opacity: 0;
		transform: translateY(18px);
		transition: all 0.35s var(--ease-out-expo);
		box-shadow: var(--shadow-card);
		text-decoration: none;
		color: inherit;
	}

	.bento-card :global(.visible) {
		opacity: 1;
		transform: translateY(0);
	}

	.bento-card:global(.visible) {
		opacity: 1;
		transform: translateY(0);
	}

	.bento-card:hover {
		transform: translateY(-5px);
		box-shadow: var(--shadow-card-hover), 6px 6px 0 var(--color-line);
		border-color: var(--color-line-dark);
	}

	/* Gradient header */
	.card-gradient {
		flex-shrink: 0;
		height: 100px;
		position: relative;
		overflow: hidden;
		border-bottom: var(--border-w) solid var(--color-line);
	}

	.card-gradient-bg {
		position: absolute;
		inset: 0;
		transition: transform 0.5s var(--ease-out-expo);
	}

	.bento-card:hover .card-gradient-bg {
		transform: scale(1.06);
	}

	.card-gradient::after {
		content: '';
		position: absolute;
		width: 80px;
		height: 80px;
		right: -20px;
		bottom: -20px;
		border: 3px solid rgba(255, 255, 255, 0.3);
		border-radius: 50%;
		z-index: 1;
	}

	/* Body */
	.card-body {
		flex: 1;
		padding: 0.85rem 1rem 1rem;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
	}

	/* Tags */
	.card-tag-row {
		display: flex;
		gap: 0.3rem;
		margin-bottom: 0.4rem;
		flex-wrap: wrap;
	}

	.card-tag {
		font-family: var(--font-mono);
		font-size: 0.54rem;
		font-weight: 400;
		padding: 0.18rem 0.5rem;
		border: 1.5px solid;
		border-radius: 999px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}

	:global(.tag-personal) {
		border-color: var(--color-accent-light);
		color: var(--color-accent-strong);
		background: color-mix(in srgb, var(--color-accent) 12%, transparent);
	}
	:global(.tag-university) {
		border-color: var(--color-info);
		color: var(--color-info);
		background: color-mix(in srgb, var(--color-info) 12%, transparent);
	}
	:global(.tag-professional) {
		border-color: var(--color-warning);
		color: var(--color-warning);
		background: color-mix(in srgb, var(--color-warning) 12%, transparent);
	}
	:global(.tag-complete) {
		border-color: var(--color-success);
		color: var(--color-success);
		background: color-mix(in srgb, var(--color-success) 12%, transparent);
	}
	:global(.tag-progress) {
		border-color: var(--color-warning);
		color: var(--color-warning);
		background: color-mix(in srgb, var(--color-warning) 12%, transparent);
	}
	:global(.tag-archived) {
		border-color: var(--color-line);
		color: var(--color-muted);
	}

	/* Title & desc */
	.card-title {
		font-family: var(--font-display);
		font-size: 1.28rem;
		font-weight: 500;
		line-height: 1.14;
		letter-spacing: -0.025em;
		margin-bottom: 0.38rem;
		color: var(--color-charcoal);
	}

	.card-desc {
		font-size: 0.86rem;
		color: var(--color-medium);
		line-height: 1.65;
		line-clamp: 2;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	/* Tech pills */
	.card-tech {
		display: flex;
		gap: 0.28rem;
		margin-top: 0.55rem;
		flex-wrap: wrap;
	}

	.card-source {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		margin-top: 0.8rem;
		font-family: var(--font-mono);
		font-size: 0.54rem;
		font-weight: 400;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--color-accent-strong);
	}

	.card-source-icon {
		flex-shrink: 0;
		color: var(--color-accent);
	}

	.tech-pill {
		font-family: var(--font-mono);
		font-size: 0.52rem;
		font-weight: 400;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		padding: 0.18rem 0.46rem;
		border-radius: 999px;
		background: color-mix(in srgb, var(--color-cream) 84%, var(--color-warm-white));
		color: var(--color-muted);
		border: 1px solid var(--color-line);
	}

	/* Arrow */
	.card-arrow {
		position: absolute;
		top: 0.85rem;
		right: 0.85rem;
		width: 30px;
		height: 30px;
		border-radius: 8px;
		background: var(--glass-strong);
		border: var(--border-w) solid rgba(255, 255, 255, 0.4);
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-medium);
		opacity: 0;
		transform: translate(-4px, 4px);
		transition: all 0.3s var(--ease-out-expo);
		z-index: 3;
	}

	.bento-card:hover .card-arrow {
		opacity: 1;
		transform: translate(0, 0);
	}
</style>
