<script lang="ts">
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

	let { data } = $props();
	let project = $derived(data.project);
	let content = $derived(data.content);
	let meta = $derived(data.meta);
</script>

<svelte:head>
	<title>{project.title} - Derek Urban</title>
</svelte:head>

<article class="project-page">
	<div class="project-banner" style="background: {project.gradient}">
		<div class="banner-fade"></div>
		<div class="banner-circle"></div>
		<div class="banner-circle banner-circle-2"></div>
	</div>

	<div class="project-content">
		<a href="/" class="back-link">
			<ArrowLeft class="back-arrow" size={14} strokeWidth={1.9} />
			All Projects
		</a>

		<header class="project-header">
			<div class="project-origin">{project.origin} Project</div>
			<h1 class="project-title">{project.title}</h1>
			<div class="project-status-row">
				<span class="project-status project-status-{project.status.toLowerCase().replace(' ', '-')}">{project.status}</span>
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

		<p class="project-desc">{project.desc}</p>

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
			<div class="prose">
				{@html content}
			</div>
		{/if}
	</div>
</article>

<style>
	.project-page {
		max-width: 860px;
		margin: 0 auto;
		padding-bottom: 5rem;
	}

	.project-banner {
		height: 220px;
		position: relative;
		overflow: hidden;
		border-bottom: var(--border-w) solid var(--color-line);
		margin-bottom: -2rem;
	}

	.banner-fade {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 90px;
		background: linear-gradient(to top, var(--color-cream), transparent);
		z-index: 1;
	}

	.banner-circle {
		position: absolute;
		width: 120px;
		height: 120px;
		right: -30px;
		bottom: -30px;
		border: 3px solid rgba(255, 255, 255, 0.2);
		border-radius: 50%;
	}

	.banner-circle-2 {
		width: 60px;
		height: 60px;
		right: 60px;
		bottom: 20px;
		border-width: 2px;
		opacity: 0.5;
	}

	.project-content {
		position: relative;
		z-index: 2;
		padding: 0 2.25rem;
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
		margin-bottom: 1.65rem;
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
		margin-bottom: 1.25rem;
	}

	.project-origin {
		font-family: var(--font-mono);
		font-size: 0.6rem;
		font-weight: 400;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--color-accent);
		margin-bottom: 0.65rem;
	}

	.project-title {
		font-family: var(--font-display);
		font-size: 2.65rem;
		font-weight: 500;
		line-height: 1.04;
		letter-spacing: -0.035em;
		margin-bottom: 0.8rem;
		color: var(--color-charcoal);
	}

	.project-status-row {
		display: flex;
		gap: 0.4rem;
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

	.meta-bar {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 0.75rem;
		padding: 1rem 0;
		margin-bottom: 1.25rem;
		border-top: var(--border-w) solid var(--color-line);
		border-bottom: var(--border-w) solid var(--color-line);
	}

	.meta-item {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
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

	.project-source-pill {
		display: inline-flex;
		align-items: center;
		gap: 0.34rem;
		margin-left: auto;
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

	.project-desc {
		font-size: 1rem;
		color: var(--color-medium);
		line-height: 1.78;
		margin-bottom: 1.75rem;
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
		border-radius: 12px;
		overflow: hidden;
		background: var(--color-warm-white);
	}

	.prose :global(.diagram-figure img) {
		width: 100%;
		height: auto;
		display: block;
		background: #faf9f7;
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

	@media (max-width: 700px) {
		.project-content {
			padding: 0 1.25rem;
		}

		.project-banner {
			height: 160px;
		}

		.project-title {
			font-size: 1.8rem;
		}

		.meta-bar {
			grid-template-columns: 1fr 1fr;
		}
	}
</style>
