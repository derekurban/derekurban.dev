<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { getProjectTheme } from '$lib/data/projectThemes';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import {
		ArrowLeft,
		ArrowUpRight,
		CalendarRange,
		Clock3,
		Code2,
		PencilRuler,
		Sparkles,
		Users
	} from 'lucide-svelte';
	import ImageLightbox from '$lib/components/ImageLightbox.svelte';

	let { data } = $props();
	let project = $derived(data.project);
	let content = $derived(data.content);
	let meta = $derived(data.meta);
	let heroSection: HTMLElement | null = $state(null);
	let projectStage: HTMLDivElement | null = $state(null);
	let proseRoot = $state<HTMLDivElement | null>(null);
	let heroForegroundStyle = $derived(project.cardForegroundStyle ?? 'title');
	let cardIconSize = $derived(project.cardIconSize ?? 78);
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

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);

		const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
		if (mediaQuery.matches) {
			return;
		}

		let timeline: gsap.core.Timeline | null = null;

		void (async () => {
			await tick();

			if (!heroSection || !projectStage) {
				return;
			}

			timeline = gsap.timeline({
				scrollTrigger: {
					trigger: heroSection,
					start: 'top top',
					end: 'bottom+=150 top',
					scrub: true,
				}
			});

			timeline.to(
				projectStage,
				{
					y: '50%',
					ease: 'none'
				},
				0
			);

			requestAnimationFrame(() => {
				ScrollTrigger.refresh();
			});
		})();

		return () => {
			timeline?.scrollTrigger?.kill();
			timeline?.kill();
		};
	});
</script>

<svelte:head>
	<title>{project.title} - Derek Urban</title>
</svelte:head>

<article class="project-page">
	<section class="project-hero" bind:this={heroSection}>
		<div bind:this={projectStage} class="project-stage" style={themeStyle}>
			<div class="project-stage-gradient"></div>
			<div class="project-stage-noise"></div>
			<div class="project-stage-shade"></div>
			<div class="project-stage-grid"></div>

			{#if project.cardForeground}
				<div class="project-stage-foreground project-stage-foreground-{heroForegroundStyle}">
					{#if heroForegroundStyle === 'icon'}
						<div class="project-stage-glass-box" style={`--project-icon-size: ${cardIconSize}%`}>
							<img src={project.cardForeground} alt="" aria-hidden="true" />
						</div>
					{:else}
						<img src={project.cardForeground} alt="" aria-hidden="true" />
					{/if}
				</div>
			{:else}
				<div class="project-stage-titlemark">
					<span>{project.title}</span>
				</div>
			{/if}
		</div>
	</section>

	<div class="project-content">
		<a href="/" class="back-link">
			<ArrowLeft class="back-arrow" size={14} strokeWidth={1.9} />
			All Projects
		</a>

		<header class="project-header">
			<div class="project-origin">{project.origin} Project</div>
			<h1 class="project-title">{project.title}</h1>
			<p class="project-desc">{project.desc}</p>

			<div class="project-status-row">
				<span class="project-status project-status-{project.status.toLowerCase().replace(' ', '-')}">
					{project.status}
				</span>
				{#if meta}
					<span class="project-meta-pill">{meta.projectSize} Project</span>
					<span class="project-meta-pill">{meta.skillLevel} Complexity</span>
				{/if}
				{#if meta?.sourceUrl}
					<a
						href={meta.sourceUrl}
						target="_blank"
						rel="noreferrer"
						class="project-status project-status-complete project-source-pill"
					>
						Source Code
						<ArrowUpRight class="project-source-icon" size={12} strokeWidth={1.9} />
					</a>
				{/if}
			</div>
		</header>

		{#if meta}
			<div class="meta-bar">
				<div class="meta-item">
					<div class="meta-head">
						<Clock3 class="meta-icon" size={14} strokeWidth={1.8} />
						<span class="meta-label">Duration</span>
					</div>
					<span class="meta-value">{meta.duration}</span>
				</div>
				<div class="meta-item">
					<div class="meta-head">
						<CalendarRange class="meta-icon" size={14} strokeWidth={1.8} />
						<span class="meta-label">Timeline</span>
					</div>
					<span class="meta-value">{meta.startDate} - {meta.endDate}</span>
				</div>
				<div class="meta-item">
					<div class="meta-head">
						<Users class="meta-icon" size={14} strokeWidth={1.8} />
						<span class="meta-label">Team</span>
					</div>
					<span class="meta-value">{meta.contributors} contributor{meta.contributors !== 1 ? 's' : ''}</span>
				</div>
				<div class="meta-item">
					<div class="meta-head">
						<PencilRuler class="meta-icon" size={14} strokeWidth={1.8} />
						<span class="meta-label">My Role</span>
					</div>
					<span class="meta-value">{meta.contribution}</span>
				</div>
			</div>
		{/if}

		<div class="section-label">
			<Code2 class="section-label-icon" size={14} strokeWidth={1.8} />
			Technology
		</div>
		<div class="tech-row">
			{#each project.tech as t}
				<span class="tech-pill">{t}</span>
			{/each}
		</div>

		{#if meta?.capabilities?.length}
			<div class="section-label">
				<Sparkles class="section-label-icon" size={14} strokeWidth={1.8} />
				Capabilities
			</div>
			<div class="capability-row">
				{#each meta.capabilities as cap}
					<span class="capability-pill">{cap}</span>
				{/each}
			</div>
		{/if}

		{#if content}
			<div bind:this={proseRoot} class="prose">
				{@html content}
			</div>
		{/if}
	</div>
</article>

<ImageLightbox container={proseRoot} />

<style>
	.project-page {
		max-width: 1080px;
		margin: 0 auto;
		padding: 6.2rem 1.4rem 5rem;
	}

	.project-hero {
		position: relative;
	}

	.project-stage {
		position: relative;
		min-height: 360px;
		border: var(--border-w) solid var(--color-line);
		border-radius: 30px;
		overflow: hidden;
		box-shadow: 0 24px 56px rgba(49, 42, 35, 0.08);
		background: color-mix(in srgb, var(--color-cream) 76%, var(--color-warm-white));
		will-change: transform;
	}

	.project-stage-gradient {
		position: absolute;
		inset: 0;
		transform: scale(1.02);
		background:
			radial-gradient(circle at 18% 18%, var(--project-glow) 0%, transparent 38%),
			linear-gradient(145deg, var(--project-surface-soft), var(--project-surface));
	}

	.project-stage-shade {
		position: absolute;
		inset: 0;
		background:
			linear-gradient(180deg, rgba(14, 12, 11, 0.02) 0%, rgba(14, 12, 11, 0.18) 100%),
			radial-gradient(circle at 16% 14%, rgba(255, 255, 255, 0.16), transparent 32%);
	}

	.project-stage-noise {
		position: absolute;
		inset: 0;
		background-image:
			linear-gradient(120deg, rgba(255, 255, 255, 0.04) 0%, transparent 38%),
			repeating-linear-gradient(
				135deg,
				rgba(255, 255, 255, 0.025) 0,
				rgba(255, 255, 255, 0.025) 1px,
				transparent 1px,
				transparent 22px
			);
		mix-blend-mode: screen;
		opacity: 0.22;
	}

	.project-stage-grid {
		position: absolute;
		inset: 1.15rem;
		border-radius: 24px;
		border: 1px solid color-mix(in srgb, var(--project-plate-border) 70%, rgba(255, 255, 255, 0.08));
		backdrop-filter: blur(2px);
	}

	.project-stage-foreground {
		position: absolute;
		inset: 1.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 2;
		filter: drop-shadow(0 30px 38px rgba(12, 10, 9, 0.34));
	}

	.project-stage-foreground-title::before {
		content: '';
		position: absolute;
		left: 50%;
		top: 50%;
		width: min(36%, 250px);
		aspect-ratio: 1;
		transform: translate(-50%, -50%);
		border-radius: 40px;
		background:
			radial-gradient(circle, color-mix(in srgb, var(--project-plate) 88%, white) 0%, transparent 72%),
			linear-gradient(180deg, var(--project-plate), rgba(255, 255, 255, 0.03));
		border: 1px solid var(--project-plate-border);
	}

	.project-stage-foreground-title {
		justify-content: center;
	}

	.project-stage-foreground-icon {
		justify-content: center;
	}

	.project-stage-glass-box {
		--project-glass-box-size: min(36%, 250px);
		position: relative;
		width: var(--project-glass-box-size);
		flex: 0 0 auto;
		aspect-ratio: 1 / 1;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 40px;
		background:
			radial-gradient(circle, color-mix(in srgb, var(--project-plate) 88%, white) 0%, transparent 72%),
			linear-gradient(180deg, var(--project-plate), rgba(255, 255, 255, 0.03));
		border: 1px solid var(--project-plate-border);
	}

	.project-stage-foreground img {
		display: block;
		max-width: min(78%, 520px);
		max-height: 160px;
		object-fit: contain;
		position: relative;
		z-index: 1;
	}

	.project-stage-foreground-icon img {
		width: var(--project-icon-size, 78%);
		height: var(--project-icon-size, 78%);
		max-width: none;
		max-height: none;
	}

	.project-stage-titlemark {
		position: absolute;
		inset: 1.5rem;
		z-index: 2;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.project-stage-titlemark span {
		display: inline-flex;
		padding: 0.65rem 0.95rem;
		border-radius: 999px;
		background: rgba(15, 13, 12, 0.72);
		backdrop-filter: blur(14px);
		font-family: var(--font-display);
		font-size: clamp(1.2rem, 2.4vw, 1.6rem);
		line-height: 1;
		color: #fff7ea;
	}

	.project-content {
		position: relative;
		z-index: 2;
		max-width: 860px;
		margin: 1rem auto 0;
		padding: 1.35rem 2rem 2.25rem;
		border: var(--border-w) solid var(--color-line);
		border-radius: 28px;
		background: color-mix(in srgb, var(--color-warm-white) 95%, var(--color-cream));
		box-shadow: 0 20px 42px rgba(49, 42, 35, 0.06);
		backdrop-filter: blur(8px);
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-family: var(--font-mono);
		font-size: 0.62rem;
		font-weight: 400;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--color-medium);
		text-decoration: none;
		margin-bottom: 1.4rem;
		padding: 0.45rem 0.8rem;
		border-radius: 999px;
		border: var(--border-w) solid var(--color-line);
		background: var(--glass);
		transition: all 0.2s var(--ease-out-expo);
	}

	.back-link:hover {
		color: var(--color-charcoal);
		border-color: var(--color-line-dark);
		transform: translateX(-2px);
		box-shadow: 3px 3px 0 var(--color-line);
	}

	.back-arrow {
		flex-shrink: 0;
		transition: transform 0.2s var(--ease-out-expo);
	}

	.back-link:hover :global(.back-arrow) {
		transform: translateX(-2px);
	}

	.project-header {
		margin-bottom: 1.5rem;
	}

	.project-origin {
		font-family: var(--font-mono);
		font-size: 0.6rem;
		font-weight: 400;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--color-accent);
		margin-bottom: 0.7rem;
	}

	.project-title {
		font-family: var(--font-display);
		font-size: clamp(2.1rem, 5vw, 3.4rem);
		font-weight: 500;
		line-height: 0.98;
		letter-spacing: -0.05em;
		margin-bottom: 0.9rem;
		color: var(--color-charcoal);
		text-wrap: balance;
	}

	.project-desc {
		max-width: 64ch;
		font-size: 1rem;
		color: var(--color-medium);
		line-height: 1.82;
		margin-bottom: 1rem;
	}

	.project-status-row {
		display: flex;
		gap: 0.45rem;
		flex-wrap: wrap;
		align-items: center;
	}

	.project-status {
		font-family: var(--font-mono);
		font-size: 0.54rem;
		font-weight: 400;
		letter-spacing: 0.14em;
		padding: 0.24rem 0.58rem;
		border: 1.5px solid;
		border-radius: 999px;
		text-transform: uppercase;
	}

	.project-status-complete {
		border-color: var(--color-success);
		color: var(--color-success);
		background: color-mix(in srgb, var(--color-success) 12%, transparent);
	}

	.project-status-in-progress {
		border-color: var(--color-warning);
		color: var(--color-warning);
		background: color-mix(in srgb, var(--color-warning) 12%, transparent);
	}

	.project-status-archived {
		border-color: var(--color-line);
		color: var(--color-muted);
	}

	.project-meta-pill {
		font-family: var(--font-mono);
		font-size: 0.52rem;
		font-weight: 400;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		padding: 0.22rem 0.54rem;
		border: 1px solid var(--color-line);
		border-radius: 999px;
		color: var(--color-muted);
	}

	.project-source-pill {
		display: inline-flex;
		align-items: center;
		gap: 0.34rem;
		text-decoration: none;
		transition: transform 0.2s var(--ease-out-expo), border-color 0.2s var(--ease-out-expo);
	}

	.project-source-pill:hover {
		transform: translateY(-1px);
		border-color: var(--color-line-dark);
	}

	.project-source-icon {
		flex-shrink: 0;
	}

	.meta-bar {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 0.8rem;
		padding: 1rem 0;
		margin-bottom: 1.4rem;
		border-top: var(--border-w) solid var(--color-line);
		border-bottom: var(--border-w) solid var(--color-line);
	}

	.meta-item {
		display: flex;
		flex-direction: column;
		gap: 0.22rem;
	}

	.meta-head {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
	}

	.meta-label {
		font-family: var(--font-mono);
		font-size: 0.54rem;
		font-weight: 400;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--color-muted);
	}

	.meta-icon {
		flex-shrink: 0;
		color: var(--color-accent);
	}

	.meta-value {
		font-family: var(--font-body);
		font-size: 0.82rem;
		font-weight: 500;
		color: var(--color-charcoal);
	}

	.section-label {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		font-family: var(--font-mono);
		font-size: 0.58rem;
		font-weight: 400;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--color-muted);
		margin-bottom: 0.7rem;
	}

	.section-label-icon {
		flex-shrink: 0;
		color: var(--color-accent);
	}

	.tech-row {
		display: flex;
		gap: 0.4rem;
		flex-wrap: wrap;
		margin-bottom: 1.5rem;
	}

	.tech-pill {
		font-family: var(--font-mono);
		font-size: 0.6rem;
		font-weight: 400;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		padding: 0.38rem 0.74rem;
		border-radius: 999px;
		border: 1px solid var(--color-line);
		background: color-mix(in srgb, var(--color-cream) 84%, var(--color-warm-white));
		color: var(--color-muted);
	}

	.capability-row {
		display: flex;
		gap: 0.35rem;
		flex-wrap: wrap;
		margin-bottom: 2rem;
	}

	.capability-pill {
		font-family: var(--font-mono);
		font-size: 0.56rem;
		font-weight: 400;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		padding: 0.28rem 0.62rem;
		border-radius: 999px;
		border: 1px solid var(--color-line);
		background: color-mix(in srgb, var(--color-accent) 8%, transparent);
		color: var(--color-accent-strong);
	}

	.prose {
		margin-top: 2rem;
		padding-top: 1.5rem;
		border-top: var(--border-w) solid var(--color-line);
	}

	.prose :global(h2) {
		font-family: var(--font-display);
		font-size: 1.62rem;
		font-weight: 500;
		line-height: 1.14;
		letter-spacing: -0.025em;
		color: var(--color-charcoal);
		margin-top: 2.5rem;
		margin-bottom: 0.85rem;
	}

	.prose :global(h2:first-child) {
		margin-top: 0;
	}

	.prose :global(h3) {
		font-family: var(--font-display);
		font-size: 1.24rem;
		font-weight: 500;
		color: var(--color-charcoal);
		margin-top: 1.75rem;
		margin-bottom: 0.55rem;
	}

	.prose :global(p) {
		font-size: 0.95rem;
		color: var(--color-medium);
		line-height: 1.82;
		margin-bottom: 1rem;
	}

	.prose :global(ul) {
		font-size: 0.95rem;
		color: var(--color-medium);
		line-height: 1.82;
		margin-bottom: 1rem;
		padding-left: 1.5rem;
		list-style: disc;
	}

	.prose :global(ol) {
		font-size: 0.95rem;
		color: var(--color-medium);
		line-height: 1.82;
		margin-bottom: 1rem;
		padding-left: 1.5rem;
		list-style: decimal;
	}

	.prose :global(li) {
		margin-bottom: 0.3rem;
	}

	.prose :global(li::marker) {
		color: var(--color-muted);
	}

	.prose :global(strong) {
		font-weight: 600;
		color: var(--color-charcoal);
	}

	.prose :global(code) {
		font-family: var(--font-mono);
		font-size: 0.74rem;
		letter-spacing: 0.04em;
		padding: 0.15rem 0.4rem;
		border-radius: 999px;
		background: var(--color-warm-white);
		border: 1px solid var(--color-line);
		color: var(--color-accent);
		font-weight: 400;
	}

	.prose :global(pre) {
		background: var(--color-warm-white);
		border: 1.5px solid var(--color-line);
		border-radius: 10px;
		padding: 1.15rem 1.25rem;
		margin-bottom: 1.25rem;
		overflow-x: auto;
	}

	.prose :global(pre code) {
		padding: 0;
		border: none;
		background: none;
		font-size: 0.76rem;
		letter-spacing: 0;
		color: var(--color-medium);
	}

	.prose :global(blockquote) {
		border-left: 3px solid var(--color-accent);
		padding-left: 1rem;
		margin: 1.25rem 0;
		color: var(--color-medium);
		font-style: italic;
	}

	.prose :global(.diagram-figure) {
		margin: 2rem 0;
		border: 1.5px solid var(--color-line);
		border-radius: 18px;
		overflow: hidden;
		background: var(--color-warm-white);
		box-shadow: 0 20px 45px rgba(49, 42, 35, 0.06);
	}

	.prose :global(.diagram-trigger) {
		position: relative;
		display: block;
		width: 100%;
		padding: 0;
		border: none;
		background: none;
		cursor: zoom-in;
	}

	.prose :global(.diagram-trigger img) {
		width: 100%;
		height: auto;
		display: block;
		background: #faf9f7;
		transition: transform 0.35s var(--ease-out-expo);
	}

	.prose :global(.diagram-trigger:hover img) {
		transform: scale(1.012);
	}

	.prose :global(.diagram-trigger::after) {
		content: '';
		position: absolute;
		inset: auto 0 0;
		height: 32%;
		background: linear-gradient(to top, rgba(15, 13, 12, 0.18), transparent);
		opacity: 0;
		transition: opacity 0.2s var(--ease-out-expo);
	}

	.prose :global(.diagram-trigger:hover::after),
	.prose :global(.diagram-trigger:focus-visible::after) {
		opacity: 1;
	}

	.prose :global(.diagram-trigger:focus-visible) {
		outline: 2px solid var(--color-accent);
		outline-offset: -2px;
	}

	.prose :global(.diagram-trigger-badge) {
		position: absolute;
		right: 0.9rem;
		bottom: 0.9rem;
		display: inline-flex;
		align-items: center;
		padding: 0.42rem 0.7rem;
		border-radius: 999px;
		background: rgba(34, 31, 27, 0.78);
		border: 1px solid rgba(255, 255, 255, 0.08);
		backdrop-filter: blur(10px);
		font-family: var(--font-mono);
		font-size: 0.56rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: #f7f2e9;
		opacity: 0.94;
	}

	.prose :global(.diagram-figure figcaption) {
		font-family: var(--font-mono);
		font-size: 0.58rem;
		font-weight: 400;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--color-muted);
		text-align: center;
		padding: 0.65rem 1rem;
		border-top: 1px solid var(--color-line);
		background: var(--color-cream);
	}

	@media (max-width: 900px) {
		.project-page {
			padding-top: 5.9rem;
			padding-left: 1rem;
			padding-right: 1rem;
		}

		.project-content {
			padding-left: 1.35rem;
			padding-right: 1.35rem;
		}

		.meta-bar {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 700px) {
		.project-stage {
			min-height: 260px;
			border-radius: 24px;
		}

		.project-stage-grid {
			inset: 0.9rem;
		}

		.project-stage-foreground {
			inset: 1.2rem;
		}

		.project-stage-glass-box {
			--project-glass-box-size: min(calc(100% - 2.4rem), 132px);
			border-radius: 28px;
		}

		.project-stage-foreground img {
			max-width: 82%;
			max-height: 108px;
		}

		.project-stage-foreground-icon img {
			width: var(--project-icon-size, 78%);
			height: var(--project-icon-size, 78%);
		}

		.project-content {
			margin-top: -1.6rem;
			padding: 1rem 1rem 1.7rem;
			border-radius: 22px;
		}

		.project-title {
			font-size: 1.95rem;
		}

		.meta-bar {
			grid-template-columns: 1fr;
		}

		.prose :global(.diagram-trigger-badge) {
			right: 0.75rem;
			bottom: 0.75rem;
			padding: 0.38rem 0.58rem;
			font-size: 0.52rem;
		}
	}
</style>
