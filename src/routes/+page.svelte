<script lang="ts">
	import { totalProjects, totalTech, totalCapabilities, yearRange } from '$lib/data/stats';
	import { LayoutGrid, BarChart3, ArrowRight } from 'lucide-svelte';

	const careerStartYear = 2017;
	const yearsActive = new Date().getFullYear() - careerStartYear;
</script>

<section
	class="relative flex min-h-[85vh] flex-col items-center justify-center px-8 pt-32 pb-16 text-center max-md:min-h-[70vh] max-md:px-6 max-md:pt-28 max-md:pb-10"
>
	<div
		class="mb-8 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-medium opacity-0"
		style="border-color: var(--color-line); border-width: var(--border-w); background: var(--glass); animation: fade-up 0.7s 0.15s var(--ease-out-expo) forwards;"
	>
		Developer &middot; Builder &middot; Since {careerStartYear}
	</div>

	<h1
		class="font-display mb-5 text-[clamp(3.6rem,8.5vw,7.5rem)] leading-[0.92] opacity-0"
		style="font-weight: 500; letter-spacing: -0.045em; animation: fade-up 0.8s 0.3s var(--ease-out-expo) forwards;"
	>
		Derek<br />
		<span class="italic" style="color: var(--color-accent); font-weight: 400;">Urban</span>
	</h1>

	<p
		class="max-w-[460px] text-[1rem] leading-[1.75] text-medium opacity-0"
		style="animation: fade-up 0.8s 0.45s var(--ease-out-expo) forwards;"
	>
		Full-stack developer with {yearsActive}+ years of building across software, systems, and
		everything between. This is where the work lives.
	</p>

	<div
		class="mt-10 h-0.5 w-10 opacity-0"
		style="background: var(--color-line-dark); animation: fade-up 0.8s 0.6s var(--ease-out-expo) forwards;"
	></div>

	<div
		class="landing-cards opacity-0"
		style="animation: fade-up 0.9s 0.8s var(--ease-out-expo) forwards;"
	>
		<a href="/projects" class="landing-card">
			<div class="landing-card-icon">
				<LayoutGrid size={18} strokeWidth={1.7} />
			</div>
			<div class="landing-card-body">
				<span class="landing-card-title">Projects</span>
				<span class="landing-card-desc">
					{totalProjects} projects spanning university, personal, and professional work
				</span>
			</div>
			<div class="landing-card-arrow">
				<ArrowRight size={16} strokeWidth={1.8} />
			</div>
		</a>

		<a href="/stats" class="landing-card">
			<div class="landing-card-icon">
				<BarChart3 size={18} strokeWidth={1.7} />
			</div>
			<div class="landing-card-body">
				<span class="landing-card-title">Skills & Stats</span>
				<span class="landing-card-desc">
					{totalTech} technologies and {totalCapabilities} capabilities, visualized
				</span>
			</div>
			<div class="landing-card-arrow">
				<ArrowRight size={16} strokeWidth={1.8} />
			</div>
		</a>
	</div>
</section>

<style>
	.landing-cards {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		margin-top: 3rem;
		width: 100%;
		max-width: 640px;
	}

	.landing-card {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: 1.5rem;
		border-radius: var(--radius-card);
		border: var(--border-w) solid var(--color-line);
		background: var(--glass);
		backdrop-filter: blur(12px);
		box-shadow: var(--shadow-card);
		text-decoration: none;
		color: inherit;
		transition:
			transform 0.35s var(--ease-out-expo),
			box-shadow 0.35s var(--ease-out-expo),
			border-color 0.25s var(--ease-out-expo);
	}

	.landing-card:hover {
		transform: translateY(-4px);
		box-shadow: var(--shadow-card-hover);
		border-color: var(--color-line-dark);
	}

	.landing-card:hover .landing-card-arrow {
		color: var(--color-accent);
		transform: translateX(3px);
	}

	.landing-card:hover .landing-card-title {
		color: var(--color-accent);
	}

	.landing-card-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 12px;
		border: var(--border-w) solid var(--color-line);
		background: var(--color-cream);
		color: var(--color-accent);
	}

	.landing-card-body {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		flex: 1;
	}

	.landing-card-title {
		font-family: var(--font-display);
		font-size: 1.15rem;
		font-weight: 500;
		letter-spacing: -0.02em;
		color: var(--color-charcoal);
		transition: color 0.2s ease;
	}

	.landing-card-desc {
		font-size: 0.82rem;
		line-height: 1.55;
		color: var(--color-muted);
	}

	.landing-card-arrow {
		display: flex;
		align-items: center;
		color: var(--color-muted);
		transition:
			color 0.2s ease,
			transform 0.3s var(--ease-out-expo);
		align-self: flex-end;
	}

	@media (max-width: 560px) {
		.landing-cards {
			grid-template-columns: 1fr;
			max-width: 340px;
		}
	}
</style>
