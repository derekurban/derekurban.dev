<script lang="ts">
	import {
		radarData,
		techRanking,
		capabilityRanking,
		projectList,
		totalProjects,
		totalTech,
		totalCapabilities,
		boosts
	} from '$lib/data/stats';
	import RadarChart from '$lib/components/RadarChart.svelte';
	import { BarChart3, Search, Zap, ArrowUpRight, ChevronDown } from 'lucide-svelte';

	const careerStartYear = 2017;
	const yearsActive = new Date().getFullYear() - careerStartYear;
	const axisLabels = radarData.map((d) => d.label);

	type Tab = 'tech' | 'skills' | 'projects';

	// All axes on by default — deselect to filter
	let selectedAxes = $state(new Set(axisLabels));
	let activeTab = $state<Tab>('tech');
	let techSearch = $state('');
	let skillSearch = $state('');
	let projectSearch = $state('');
	let boostOpen = $state(false);

	const techMaxCount = techRanking[0]?.count ?? 1;
	const skillMaxCount = capabilityRanking[0]?.count ?? 1;
	const allCount = axisLabels.length;

	function toggleAxis(label: string) {
		const next = new Set(selectedAxes);
		if (next.has(label)) {
			next.delete(label);
		} else {
			next.add(label);
		}
		selectedAxes = next;
	}

	// Axis-filtered slices
	const axisTech = $derived(
		selectedAxes.size === allCount
			? techRanking
			: techRanking.filter((i) => i.axes.some((a) => selectedAxes.has(a)))
	);
	const axisSkills = $derived(
		selectedAxes.size === allCount
			? capabilityRanking
			: capabilityRanking.filter((i) => i.axes.some((a) => selectedAxes.has(a)))
	);
	const axisProjects = $derived(
		selectedAxes.size === allCount
			? projectList
			: projectList.filter((p) => p.axes.some((a) => selectedAxes.has(a)))
	);

	// Search-filtered slices
	const filteredTech = $derived(
		techSearch.trim()
			? axisTech.filter((i) => i.name.toLowerCase().includes(techSearch.toLowerCase().trim()))
			: axisTech
	);
	const filteredSkills = $derived(
		skillSearch.trim()
			? axisSkills.filter((i) => i.name.toLowerCase().includes(skillSearch.toLowerCase().trim()))
			: axisSkills
	);
	const filteredProjects = $derived(
		projectSearch.trim()
			? axisProjects.filter((p) =>
					p.title.toLowerCase().includes(projectSearch.toLowerCase().trim())
				)
			: axisProjects
	);

	const currentSearch = $derived(
		activeTab === 'tech' ? techSearch : activeTab === 'skills' ? skillSearch : projectSearch
	);
	const currentShowing = $derived(
		activeTab === 'tech'
			? filteredTech.length
			: activeTab === 'skills'
				? filteredSkills.length
				: filteredProjects.length
	);
	const currentTotal = $derived(
		activeTab === 'tech'
			? techRanking.length
			: activeTab === 'skills'
				? capabilityRanking.length
				: projectList.length
	);

	function setSearch(val: string) {
		if (activeTab === 'tech') techSearch = val;
		else if (activeTab === 'skills') skillSearch = val;
		else projectSearch = val;
	}
</script>

<svelte:head>
	<title>Derek Urban — Stats</title>
</svelte:head>

<!-- Page Header -->
<section class="page-header">
	<div
		class="header-badge"
		style="animation: fade-up 0.7s 0.15s var(--ease-out-expo) forwards;"
	>
		<BarChart3 size={13} strokeWidth={1.8} />
		Skills &middot; {totalProjects} Projects
	</div>
	<h1 style="animation: fade-up 0.8s 0.3s var(--ease-out-expo) forwards;">
		Skills &amp; <em>Stats</em>
	</h1>
	<p style="animation: fade-up 0.8s 0.45s var(--ease-out-expo) forwards;">
		A data-driven breakdown of {totalProjects} projects — technologies, capabilities, and how they
		connect.
	</p>
	<div
		class="header-divider"
		style="animation: fade-up 0.8s 0.6s var(--ease-out-expo) forwards;"
	></div>
</section>

<!-- Summary Stats -->
<div
	class="section-inner"
	style="animation: fade-up 0.8s 0.7s var(--ease-out-expo) forwards; opacity: 0;"
>
	<div class="summary-grid">
		<div class="stat-card">
			<span class="stat-number">{totalProjects}</span>
			<span class="stat-label">Projects</span>
		</div>
		<div class="stat-card">
			<span class="stat-number">{totalTech}</span>
			<span class="stat-label">Technologies</span>
		</div>
		<div class="stat-card">
			<span class="stat-number">{totalCapabilities}</span>
			<span class="stat-label">Capabilities</span>
		</div>
		<div class="stat-card">
			<span class="stat-number">{yearsActive}+</span>
			<span class="stat-label">Years Active</span>
		</div>
	</div>
</div>

<!-- Axis Filter Bar -->
<div
	class="section-inner filter-row"
	style="animation: fade-up 0.8s 0.8s var(--ease-out-expo) forwards; opacity: 0;"
>
	<div class="filter-bar">
		{#each axisLabels as label}
			<button
				type="button"
				class="filter-chip"
				class:chip-active={selectedAxes.has(label)}
				class:chip-dormant={!selectedAxes.has(label)}
				onclick={() => toggleAxis(label)}
				aria-pressed={selectedAxes.has(label)}
			>
				{label}
			</button>
		{/each}
	</div>
</div>

<!-- Main: Radar + List -->
<div
	class="section-inner main-section"
	style="animation: fade-up 0.9s 0.95s var(--ease-out-expo) forwards; opacity: 0;"
>
	<!-- Left: Radar + Boost -->
	<div class="radar-col">
		<div class="card radar-card">
			<RadarChart data={radarData} {selectedAxes} onAxisClick={toggleAxis} />
			<p class="radar-note">
				Click an area to toggle — combine categories to cross-reference skills.
			</p>
		</div>

		{#if boosts.length > 0}
			<div class="boost-card">
				<button
					type="button"
					class="boost-toggle"
					onclick={() => (boostOpen = !boostOpen)}
					aria-expanded={boostOpen}
				>
					<div class="boost-header">
						<Zap size={12} strokeWidth={2} />
						<span class="boost-title">Skill Boost Active</span>
					</div>
					<span class="boost-chevron" class:boost-chevron-open={boostOpen}>
						<ChevronDown size={14} strokeWidth={2} />
					</span>
				</button>
				{#if boostOpen}
					<div class="boost-body">
						<div class="boost-list">
							{#each boosts as boost}
								<div class="boost-row">
									<span class="boost-axis-tag">
										{boost.axis}{'✦'.repeat(boost.stars ?? 1)}
									</span>
									<ul class="boost-bullets">
										{#each boost.bullets as bullet}
											<li class="boost-bullet">{bullet}</li>
										{/each}
									</ul>
								</div>
							{/each}
						</div>
						<p class="boost-footer">
							Reflects current skills and active work not yet documented in projects.
						</p>
					</div>
				{/if}
			</div>
		{/if}
	</div>

	<!-- Right: Tabbed List -->
	<div class="card list-card">
		<!-- Tab Row -->
		<div class="list-tabs">
			<button
				type="button"
				class="filter-chip tab-chip"
				class:chip-active={activeTab === 'tech'}
				class:chip-dormant={activeTab !== 'tech'}
				onclick={() => (activeTab = 'tech')}
			>
				Technologies
				<span class="tab-count">{axisTech.length}</span>
			</button>
			<button
				type="button"
				class="filter-chip tab-chip"
				class:chip-active={activeTab === 'skills'}
				class:chip-dormant={activeTab !== 'skills'}
				onclick={() => (activeTab = 'skills')}
			>
				Capabilities
				<span class="tab-count">{axisSkills.length}</span>
			</button>
			<button
				type="button"
				class="filter-chip tab-chip"
				class:chip-active={activeTab === 'projects'}
				class:chip-dormant={activeTab !== 'projects'}
				onclick={() => (activeTab = 'projects')}
			>
				Projects
				<span class="tab-count">{axisProjects.length}</span>
			</button>
		</div>

		<!-- Search + Count -->
		<div class="list-search">
			<div class="search-wrap">
				<span class="search-icon" aria-hidden="true">
					<Search size={13} strokeWidth={2} />
				</span>
				<input
					type="search"
					class="search-input"
					placeholder={activeTab === 'tech'
						? 'Search technologies…'
						: activeTab === 'skills'
							? 'Search capabilities…'
							: 'Search projects…'}
					value={currentSearch}
					oninput={(e) => setSearch((e.target as HTMLInputElement).value)}
					aria-label={activeTab === 'tech'
						? 'Search technologies'
						: activeTab === 'skills'
							? 'Search capabilities'
							: 'Search projects'}
				/>
			</div>
			<span class="list-meta">{currentShowing}/{currentTotal}</span>
		</div>

		<!-- List Content -->
		<ul class="item-list" role="list">
			{#if activeTab === 'projects'}
				<!-- Projects tab: name + link -->
				{#each filteredProjects as project (project.slug)}
					<li class="project-row">
						<a href="/projects/{project.slug}" class="project-link">{project.title}</a>
						<ArrowUpRight size={13} strokeWidth={1.8} class="project-arrow" />
					</li>
				{/each}
				{#if filteredProjects.length === 0}
					<li class="item-empty">
						{projectSearch.trim()
							? `No results for \u201c${projectSearch}\u201d`
							: 'No projects in this selection'}
					</li>
				{/if}
			{:else}
				<!-- Tech / Capabilities tabs: name + bar + pill -->
				{@const items = activeTab === 'tech' ? filteredTech : filteredSkills}
				{@const maxCount = activeTab === 'tech' ? techMaxCount : skillMaxCount}
				{#each items as item (item.name)}
					<li class="item-row">
						<span class="item-name">{item.name}</span>
						<div class="item-track">
							<div class="item-fill" style="width: {(item.count / maxCount) * 100}%"></div>
						</div>
						<span class="count-pill">{item.count} proj</span>
					</li>
				{/each}
				{#if items.length === 0}
					<li class="item-empty">
						{currentSearch.trim()
							? `No results for \u201c${currentSearch}\u201d`
							: `No ${activeTab === 'tech' ? 'technologies' : 'capabilities'} in this selection`}
					</li>
				{/if}
			{/if}
		</ul>
	</div>
</div>

<style>
	/* ── Layout ─────────────────────────────────── */

	.page-header {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: 8rem 2rem 3rem;
		gap: 1.25rem;
	}

	.section-inner {
		width: 100%;
		max-width: 1160px;
		margin: 0 auto;
		padding: 0 2rem;
	}

	.filter-row {
		margin-top: 1.5rem;
	}

	.main-section {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1.25rem;
		padding-bottom: 5rem;
		margin-top: 1.25rem;
		align-items: start;
	}

	/* ── Header ─────────────────────────────────── */

	.header-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.4rem 1rem;
		border-radius: 999px;
		border: var(--border-w) solid var(--color-line);
		background: var(--glass);
		font-family: var(--font-mono);
		font-size: 0.62rem;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--color-medium);
		opacity: 0;
	}

	.page-header h1 {
		font-family: var(--font-display);
		font-size: clamp(3.2rem, 7.5vw, 6.75rem);
		font-weight: 500;
		letter-spacing: -0.04em;
		line-height: 0.95;
		color: var(--color-charcoal);
		margin: 0;
		opacity: 0;
	}

	.page-header h1 em {
		font-style: italic;
		color: var(--color-accent);
		font-weight: 400;
	}

	.page-header p {
		max-width: 440px;
		font-size: 1rem;
		line-height: 1.75;
		color: var(--color-medium);
		margin: 0;
		opacity: 0;
	}

	.header-divider {
		width: 2.5rem;
		height: 0.5px;
		background: var(--color-line-dark);
		margin-top: 1.25rem;
		opacity: 0;
	}

	/* ── Summary Stats ──────────────────────────── */

	.summary-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1rem;
	}

	.stat-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.35rem;
		padding: 1.5rem 1rem;
		border-radius: var(--radius-card);
		border: var(--border-w) solid var(--color-line);
		background: var(--glass);
		text-align: center;
	}

	.stat-number {
		font-family: var(--font-display);
		font-size: clamp(1.8rem, 3vw, 2.6rem);
		font-weight: 500;
		letter-spacing: -0.03em;
		color: var(--color-charcoal);
		line-height: 1;
	}

	.stat-label {
		font-family: var(--font-mono);
		font-size: 0.6rem;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--color-muted);
	}

	/* ── Filter Bar ─────────────────────────────── */

	.filter-bar {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.5rem;
		perspective: 600px;
	}

	/* ── Filter Chips (matches projects FilterBar style) ── */

	.filter-chip {
		font-family: var(--font-mono);
		font-size: 0.62rem;
		font-weight: 400;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		padding: 0.5rem 0.9rem;
		border-radius: 100px;
		cursor: pointer;
		position: relative;
		transform-style: preserve-3d;
		transition:
			transform 0.35s var(--ease-out-expo),
			box-shadow 0.35s var(--ease-out-expo),
			background 0.25s var(--ease-out-expo),
			border-color 0.25s var(--ease-out-expo),
			color 0.25s var(--ease-out-expo),
			opacity 0.25s var(--ease-out-expo);
	}

	.chip-dormant {
		background: var(--glass);
		border: var(--border-w) solid var(--color-line);
		color: var(--color-medium);
		transform: translateY(0) translateZ(0) rotateX(0deg);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
	}

	.chip-dormant:hover {
		border-color: var(--color-line-dark);
		color: var(--color-charcoal);
		transform: translateY(-1px) translateZ(4px) rotateX(-1deg);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
	}

	.chip-active {
		background: var(--color-accent);
		border: var(--border-w) solid var(--color-accent);
		color: var(--color-warm-white);
		transform: translateY(-4px) translateZ(16px) rotateX(-3deg);
		box-shadow:
			0 6px 20px rgba(49, 42, 35, 0.16),
			0 2px 6px rgba(49, 42, 35, 0.08),
			4px 4px 0 var(--color-line-dark);
	}

	.chip-active:hover {
		transform: translateY(-5px) translateZ(20px) rotateX(-4deg);
		box-shadow:
			0 8px 28px rgba(49, 42, 35, 0.18),
			0 3px 8px rgba(49, 42, 35, 0.1),
			5px 5px 0 var(--color-line-dark);
	}

	/* ── Cards ──────────────────────────────────── */

	.card {
		border-radius: var(--radius-card);
		border: var(--border-w) solid var(--color-line);
		background: var(--glass);
		backdrop-filter: blur(12px);
		box-shadow: var(--shadow-card);
	}

	/* ── Radar Column ───────────────────────────── */

	.radar-col {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.radar-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		padding: 2rem 1.5rem 1.5rem;
	}

	.radar-note {
		font-family: var(--font-mono);
		font-size: 0.6rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-muted);
		text-align: center;
		margin: 0;
	}

	/* ── Boost Card ─────────────────────────────── */

	.boost-card {
		border-radius: var(--radius-card);
		border: var(--border-w) solid var(--color-line);
		border-left: 3px solid var(--color-accent);
		background: var(--glass);
		backdrop-filter: blur(12px);
		display: flex;
		flex-direction: column;
	}

	.boost-toggle {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: 0.875rem 1.25rem;
		background: none;
		border: none;
		cursor: pointer;
		transition: opacity 0.15s ease;
	}

	.boost-toggle:hover {
		opacity: 0.8;
	}

	.boost-header {
		display: flex;
		align-items: center;
		gap: 0.45rem;
		color: var(--color-accent);
	}

	.boost-title {
		font-family: var(--font-mono);
		font-size: 0.6rem;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--color-accent);
	}

	.boost-chevron {
		display: flex;
		align-items: center;
		color: var(--color-muted);
		transition: transform 0.3s var(--ease-out-expo);
	}

	.boost-chevron-open {
		transform: rotate(180deg);
	}

	.boost-body {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: 0 1.25rem 0.875rem;
		border-top: var(--border-w) solid var(--color-line);
		padding-top: 0.75rem;
	}

	.boost-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.boost-row {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	.boost-axis-tag {
		display: inline-flex;
		align-items: center;
		padding: 0.18rem 0.55rem;
		border-radius: 999px;
		border: var(--border-w) solid var(--color-accent);
		color: var(--color-accent);
		font-family: var(--font-mono);
		font-size: 0.54rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		width: fit-content;
		gap: 0.2rem;
	}

	.boost-bullets {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.18rem;
	}

	.boost-bullet {
		font-size: 0.76rem;
		color: var(--color-medium);
		line-height: 1.45;
		padding-left: 1rem;
		position: relative;
	}

	.boost-bullet::before {
		content: '·';
		position: absolute;
		left: 0.3rem;
		color: var(--color-accent);
		font-size: 1rem;
		line-height: 1.1;
	}

	.boost-footer {
		font-family: var(--font-mono);
		font-size: 0.56rem;
		letter-spacing: 0.07em;
		color: var(--color-muted);
		margin: 0;
		padding-top: 0.65rem;
		border-top: var(--border-w) solid var(--color-line);
		line-height: 1.5;
	}

	/* ── List Card ──────────────────────────────── */

	.list-card {
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	/* ── Tabs ───────────────────────────────────── */

	.list-tabs {
		display: flex;
		gap: 0.5rem;
		padding: 1rem 1.25rem 0.75rem;
		border-bottom: var(--border-w) solid var(--color-line);
		perspective: 600px;
		flex-shrink: 0;
		flex-wrap: wrap;
	}

	.tab-chip {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
	}

	.tab-count {
		font-size: 0.58rem;
		opacity: 0.75;
		line-height: 1;
	}

	/* ── Search Row ─────────────────────────────── */

	.list-search {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.875rem 1.25rem;
		border-bottom: var(--border-w) solid var(--color-line);
		flex-shrink: 0;
	}

	.search-wrap {
		position: relative;
		display: flex;
		align-items: center;
		flex: 1;
	}

	.search-icon {
		position: absolute;
		left: 0.75rem;
		display: flex;
		align-items: center;
		color: var(--color-muted);
		pointer-events: none;
	}

	.search-input {
		width: 100%;
		padding: 0.5rem 0.85rem 0.5rem 2.2rem;
		border-radius: 999px;
		border: var(--border-w) solid var(--color-line);
		background: var(--color-cream);
		font-family: var(--font-body);
		font-size: 0.8rem;
		color: var(--color-charcoal);
		outline: none;
		transition:
			border-color 0.2s var(--ease-out-expo),
			background 0.2s var(--ease-out-expo);
		appearance: none;
	}

	.search-input::placeholder {
		color: var(--color-muted);
	}

	.search-input:focus {
		border-color: var(--color-accent);
		background: var(--color-warm-white);
	}

	.list-meta {
		font-family: var(--font-mono);
		font-size: 0.6rem;
		letter-spacing: 0.1em;
		color: var(--color-muted);
		white-space: nowrap;
		flex-shrink: 0;
	}

	/* ── Item List ──────────────────────────────── */

	.item-list {
		list-style: none;
		margin: 0;
		padding: 0;
		overflow-y: auto;
		max-height: 26rem;
	}

	.item-list::-webkit-scrollbar {
		width: 4px;
	}

	.item-list::-webkit-scrollbar-thumb {
		background: var(--color-line-dark);
		border-radius: 2px;
	}

	/* ── Tech / Capabilities rows ───────────────── */

	.item-row {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1.6fr) auto;
		align-items: center;
		gap: 0.6rem;
		padding: 0.52rem 1.25rem;
		border-bottom: var(--border-w) solid var(--color-line);
		transition: background 0.15s ease;
	}

	.item-row:last-child {
		border-bottom: none;
	}

	.item-row:hover {
		background: var(--glass);
	}

	.item-name {
		font-size: 0.8rem;
		color: var(--color-charcoal);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		line-height: 1.3;
	}

	.item-track {
		height: 4px;
		border-radius: 999px;
		background: var(--color-line);
		overflow: hidden;
	}

	.item-fill {
		height: 100%;
		border-radius: 999px;
		background: var(--color-accent);
	}

	.count-pill {
		font-family: var(--font-mono);
		font-size: 0.54rem;
		letter-spacing: 0.08em;
		color: var(--color-muted);
		padding: 0.2rem 0.5rem;
		border-radius: 999px;
		border: var(--border-w) solid var(--color-line);
		white-space: nowrap;
		text-align: center;
		line-height: 1.4;
	}

	/* ── Project rows ───────────────────────────── */

	.project-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		padding: 0.6rem 1.25rem;
		border-bottom: var(--border-w) solid var(--color-line);
		transition: background 0.15s ease;
	}

	.project-row:last-child {
		border-bottom: none;
	}

	.project-row:hover {
		background: var(--glass);
	}

	.project-link {
		font-size: 0.82rem;
		color: var(--color-charcoal);
		text-decoration: none;
		flex: 1;
		line-height: 1.3;
		transition: color 0.15s ease;
	}

	.project-row:hover .project-link {
		color: var(--color-accent);
	}

	:global(.project-arrow) {
		color: var(--color-muted);
		flex-shrink: 0;
		transition: color 0.15s ease;
	}

	.project-row:hover :global(.project-arrow) {
		color: var(--color-accent);
	}

	.item-empty {
		padding: 2rem 1.5rem;
		font-size: 0.82rem;
		color: var(--color-muted);
		text-align: center;
		font-style: italic;
	}

	/* ── Responsive ─────────────────────────────── */

	@media (max-width: 900px) {
		.page-header {
			padding: 7.5rem 1.5rem 3rem;
		}

		.section-inner {
			padding: 0 1.25rem;
		}

		.main-section {
			grid-template-columns: 1fr;
		}

		.summary-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 480px) {
		.summary-grid {
			gap: 0.75rem;
		}

		.radar-card {
			padding: 1.5rem 0.75rem 1.25rem;
		}

		.list-tabs {
			padding: 0.875rem 1rem 0.75rem;
			gap: 0.4rem;
		}

		.item-row,
		.project-row {
			padding: 0.48rem 1rem;
		}

		.filter-bar {
			gap: 0.4rem;
		}
	}
</style>
