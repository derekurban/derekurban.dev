<script lang="ts">
	import { getProjectTheme } from '$lib/data/projectThemes';
	import type { Project } from '$lib/types/project';
	import { reveal } from '$lib/actions/reveal';
	import { ArrowUpRight, FolderGit2, Star } from 'lucide-svelte';

	interface Props {
		project: Project;
		index: number;
		href: string;
		skipReveal?: boolean;
	}

	let { project, index, href, skipReveal = false }: Props = $props();
	let foregroundStyle = $derived(project.cardForegroundStyle ?? 'title');
	let cardIconSize = $derived(project.cardIconSize ?? 78);
	let visibleTags = $derived(project.tags.slice(0, 3));
	let visibleTech = $derived(project.tech.slice(0, 3));
	let sourceLabel = $derived(project.archived ? 'Archived source' : 'Source code');
	let theme = $derived(getProjectTheme(project.cardTheme));
	let themeStyle = $derived(
		[
			`--project-surface: ${theme.surface}`,
			`--project-surface-soft: ${theme.surfaceSoft}`,
			`--project-glow: ${theme.glow}`,
			`--project-accent: ${theme.accent}`,
			`--project-plate: ${theme.plate}`,
			`--project-plate-border: ${theme.plateBorder}`
		].join('; ')
	);
</script>

<a
	class="bento-card"
	{href}
	use:reveal={{ delay: index * 36, skip: skipReveal }}
>
	<div class="card-media" style={themeStyle} aria-hidden="true">
		<div class="card-media-gradient"></div>
		<div class="card-media-noise"></div>
		<div class="card-media-shade"></div>
		<div class="card-media-frame"></div>

		{#if project.cardForeground}
			<div class="card-foreground-shell card-foreground-shell-{foregroundStyle}">
				{#if foregroundStyle === 'icon'}
					<div class="card-glass-box" style={`--card-icon-size: ${cardIconSize}%`}>
						<img class="card-foreground" src={project.cardForeground} alt="" loading="lazy" />
					</div>
				{:else}
					<img class="card-foreground" src={project.cardForeground} alt="" loading="lazy" />
				{/if}
			</div>
		{:else}
			<div class="card-foreground-fallback">
				<span>{project.title}</span>
			</div>
		{/if}
	</div>

	<div class="card-arrow">
		<ArrowUpRight size={14} strokeWidth={1.9} />
	</div>

	<div class="card-body">
		<div class="card-kicker-row">
			<span class="card-origin">{project.origin}</span>
			<span class="card-status">{project.status}</span>
		</div>

		<h3 class="card-title">{project.title}</h3>

		<div class="card-tag-row">
			{#each visibleTags as tag}
				<span class="card-tag">{tag}</span>
			{/each}
		</div>

		<p class="card-desc">{project.desc}</p>

		<div class="card-footer">
			<div class="card-tech">
				{#each visibleTech as t}
					<span class="tech-pill">{t}</span>
				{/each}
			</div>

			<div class="card-footer-meta">
				{#if project.sourceUrl}
					<div class="card-source">
						<FolderGit2 class="card-source-icon" size={12} strokeWidth={1.8} />
						<span>{sourceLabel}</span>
					</div>
				{/if}

				{#if project.pinned}
					<div class="card-pin" aria-label="Pinned project" title="Pinned project">
						<Star size={13} strokeWidth={1.9} fill="currentColor" />
					</div>
				{/if}
			</div>
		</div>
	</div>
</a>

<style>
	.bento-card {
		width: 100%;
		height: 100%;
		background:
			linear-gradient(180deg, rgba(255, 255, 255, 0.08), transparent 34%),
			var(--color-warm-white);
		border: var(--border-w) solid var(--color-line);
		border-radius: var(--radius-card);
		overflow: hidden;
		cursor: pointer;
		position: relative;
		display: flex;
		flex-direction: column;
		opacity: 0;
		transform: translate3d(0, 18px, 0) scale(0.985);
		transition:
			opacity 0.42s var(--ease-out-expo) var(--reveal-delay, 0ms),
			transform 0.56s var(--ease-out-expo) var(--reveal-delay, 0ms),
			box-shadow 0.28s var(--ease-out-expo) 0ms,
			border-color 0.28s var(--ease-out-expo) 0ms;
		box-shadow: var(--shadow-card);
		text-decoration: none;
		color: inherit;
		will-change: opacity, transform;
	}

	.bento-card :global(.visible) {
		opacity: 1;
		transform: translateY(0);
	}

	.bento-card:global(.visible) {
		opacity: 1;
		transform: translate3d(0, 0, 0) scale(1);
	}

	.bento-card:hover {
		transform: translateY(-6px) rotate(-0.35deg);
		box-shadow: var(--shadow-card-hover), 6px 6px 0 rgba(49, 42, 35, 0.08);
		border-color: var(--color-line-dark);
	}

	.card-media {
		position: relative;
		flex: 1 1 auto;
		min-height: 190px;
		overflow: hidden;
		border-bottom: var(--border-w) solid var(--color-line);
		background: color-mix(in srgb, var(--color-cream) 72%, var(--color-warm-white));
	}

	.card-media-gradient {
		position: absolute;
		inset: 0;
		transform: scale(1.02);
		transition: transform 0.7s var(--ease-out-expo);
		background:
			radial-gradient(circle at 18% 18%, var(--project-glow) 0%, transparent 38%),
			linear-gradient(145deg, var(--project-surface-soft), var(--project-surface));
	}

	.bento-card:hover .card-media-gradient {
		transform: scale(1.07);
	}

	.card-media-shade {
		position: absolute;
		inset: 0;
		background:
			linear-gradient(180deg, rgba(14, 12, 11, 0.02) 0%, rgba(14, 12, 11, 0.14) 100%),
			radial-gradient(circle at top left, rgba(255, 255, 255, 0.18), transparent 42%);
	}

	.card-media-noise {
		position: absolute;
		inset: 0;
		background-image:
			linear-gradient(115deg, rgba(255, 255, 255, 0.03) 0%, transparent 44%),
			repeating-linear-gradient(
				135deg,
				rgba(255, 255, 255, 0.035) 0,
				rgba(255, 255, 255, 0.035) 1px,
				transparent 1px,
				transparent 16px
			);
		mix-blend-mode: screen;
		opacity: 0.26;
	}

	.card-media-frame {
		position: absolute;
		inset: 0.8rem;
		border: 1px solid color-mix(in srgb, var(--project-plate-border) 70%, rgba(255, 255, 255, 0.08));
		border-radius: 16px;
		backdrop-filter: blur(2px);
	}

	.card-foreground-shell {
		position: absolute;
		inset: 1.55rem 1rem;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 2;
		filter: drop-shadow(0 22px 26px rgba(12, 10, 9, 0.28));
		transition: transform 0.45s var(--ease-out-expo);
	}

	.card-foreground-shell-title::before {
		content: '';
		position: absolute;
		left: 50%;
		top: 50%;
		width: min(72%, 180px);
		aspect-ratio: 1;
		transform: translate(-50%, -50%);
		border-radius: 32px;
		background:
			radial-gradient(circle, color-mix(in srgb, var(--project-plate) 90%, white) 0%, transparent 72%),
			linear-gradient(180deg, var(--project-plate), rgba(255, 255, 255, 0.04));
		border: 1px solid var(--project-plate-border);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.18);
	}

	.bento-card:hover .card-foreground-shell {
		transform: translateY(-4px);
	}

	.card-foreground-shell-title {
		justify-content: center;
	}

	.card-foreground-shell-icon {
		container-type: size;
		justify-content: center;
	}

	.card-glass-box {
		--card-glass-box-size: min(72cqi, 100cqb, 180px);
		position: relative;
		width: var(--card-glass-box-size);
		height: var(--card-glass-box-size);
		flex: 0 0 auto;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 32px;
		background:
			radial-gradient(circle, color-mix(in srgb, var(--project-plate) 90%, white) 0%, transparent 72%),
			linear-gradient(180deg, var(--project-plate), rgba(255, 255, 255, 0.04));
		border: 1px solid var(--project-plate-border);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.18);
	}

	.card-foreground {
		display: block;
		width: auto;
		max-width: min(84%, 280px);
		max-height: 110px;
		object-fit: contain;
		position: relative;
		z-index: 1;
	}

	.card-foreground-shell-icon .card-foreground {
		width: var(--card-icon-size, 78%);
		height: var(--card-icon-size, 78%);
		max-width: none;
		max-height: none;
	}

	.card-foreground-fallback {
		position: absolute;
		inset: 1rem;
		z-index: 2;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.card-foreground-fallback span {
		display: inline-flex;
		padding: 0.55rem 0.8rem;
		border-radius: 999px;
		background: rgba(15, 13, 12, 0.72);
		backdrop-filter: blur(14px);
		font-family: var(--font-display);
		font-size: 1rem;
		line-height: 1;
		color: #fff7ea;
	}

	.card-body {
		flex: 0 0 176px;
		padding: 0.9rem 1rem 1rem;
		display: flex;
		flex-direction: column;
		background: color-mix(in srgb, var(--color-warm-white) 94%, var(--color-cream));
	}

	.card-kicker-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.7rem;
		margin-bottom: 0.45rem;
	}

	.card-origin,
	.card-status {
		font-family: var(--font-mono);
		font-size: 0.52rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-muted);
	}

	.card-tag-row {
		display: flex;
		gap: 0.3rem;
		margin-bottom: 0.45rem;
		flex-wrap: wrap;
	}

	.card-tag {
		font-family: var(--font-mono);
		font-size: 0.5rem;
		font-weight: 400;
		padding: 0.16rem 0.44rem;
		border: 1px solid var(--color-line);
		border-radius: 999px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-muted);
		background: color-mix(in srgb, var(--color-cream) 80%, var(--color-warm-white));
	}

	.card-title {
		font-family: var(--font-display);
		font-size: 1.18rem;
		font-weight: 500;
		line-height: 1.08;
		letter-spacing: -0.03em;
		margin-bottom: 0.38rem;
		color: var(--color-charcoal);
		line-clamp: 2;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.card-desc {
		font-size: 0.82rem;
		color: var(--color-medium);
		line-height: 1.56;
		display: -webkit-box;
		line-clamp: 2;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.card-footer {
		margin-top: auto;
		padding-top: 0.7rem;
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}

	.card-tech {
		display: flex;
		gap: 0.24rem;
		flex-wrap: wrap;
	}

	.tech-pill {
		font-family: var(--font-mono);
		font-size: 0.48rem;
		font-weight: 400;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		padding: 0.16rem 0.4rem;
		border-radius: 999px;
		background: color-mix(in srgb, var(--color-cream) 88%, var(--color-warm-white));
		color: var(--color-muted);
		border: 1px solid var(--color-line);
	}

	.card-source {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
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

	.card-footer-meta {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.6rem;
		min-height: 1rem;
	}

	.card-arrow {
		position: absolute;
		top: 0.85rem;
		right: 0.85rem;
		width: 30px;
		height: 30px;
		border-radius: 999px;
		background: rgba(255, 252, 248, 0.58);
		border: 1px solid rgba(255, 255, 255, 0.28);
		backdrop-filter: blur(14px);
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-medium);
		opacity: 0;
		transform: translate(-4px, 4px);
		transition: all 0.3s var(--ease-out-expo);
		z-index: 3;
	}

	.card-pin {
		margin-left: auto;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		color: var(--color-accent-strong);
	}

	.bento-card:hover .card-arrow {
		opacity: 1;
		transform: translate(0, 0);
	}

	@media (max-width: 700px) {
		.card-media {
			min-height: 180px;
		}

		.card-media-frame {
			inset: 0.9rem;
		}

		.card-foreground-shell {
			inset: 1.2rem;
		}

		.card-glass-box {
			--card-glass-box-size: min(100cqi, 100cqb, 132px);
			border-radius: 28px;
		}

		.card-body {
			flex-basis: 176px;
		}

		.card-foreground {
			max-width: min(82%, 240px);
			max-height: 92px;
		}

		.card-foreground-shell-icon .card-foreground {
			width: var(--card-icon-size, 78%);
			height: var(--card-icon-size, 78%);
		}
	}
</style>
