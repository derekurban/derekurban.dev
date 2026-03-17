<script lang="ts">
	import type { RadarAxis } from '$lib/data/stats';

	let { data, selectedAxes, onAxisClick }: {
		data: RadarAxis[];
		selectedAxes: Set<string>;
		onAxisClick?: (label: string) => void;
	} = $props();

	const W = 580;
	const H = 460;
	const cx = W / 2;
	const cy = H / 2 - 8;
	const maxR = 152;
	const labelR = maxR + 38;
	const levels = 4;
	const n = data.length;

	// True when no filtering is active (all axes on)
	const allSelected = $derived(selectedAxes.size === n);

	function θ(i: number): number {
		return (2 * Math.PI * i) / n - Math.PI / 2;
	}

	function pt(angle: number, r: number): [number, number] {
		return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
	}

	function levelPoints(level: number): string {
		const r = (maxR * level) / levels;
		return Array.from({ length: n }, (_, i) => pt(θ(i), r).join(',')).join(' ');
	}

	function dataPoints(): string {
		return data.map((d, i) => pt(θ(i), maxR * d.value).join(',')).join(' ');
	}

	function labelPos(i: number) {
		const a = θ(i);
		const [x, y] = pt(a, labelR);
		const cosA = Math.cos(a);
		let anchor: 'start' | 'middle' | 'end' = 'middle';
		if (cosA > 0.15) anchor = 'start';
		if (cosA < -0.15) anchor = 'end';
		return { x, y, anchor };
	}
</script>

<svg viewBox="0 0 {W} {H}" class="radar" aria-label="Skill area radar chart" role="img">
	<!-- Grid rings -->
	{#each Array.from({ length: levels }, (_, i) => i + 1) as lvl}
		<polygon
			points={levelPoints(lvl)}
			fill="none"
			stroke="var(--color-line-dark)"
			stroke-width="1"
			opacity={0.4 + (lvl / levels) * 0.5}
		/>
	{/each}

	<!-- Center -->
	<circle cx={cx} cy={cy} r="2.5" fill="var(--color-muted)" opacity="0.5" />

	<!-- Data fill -->
	<polygon
		points={dataPoints()}
		fill="var(--color-accent)"
		fill-opacity="0.12"
		stroke="var(--color-accent)"
		stroke-width="2"
		stroke-linejoin="round"
	/>

	<!-- Data dots — selected axes full, deselected dimmed; boosted axes get a dashed ring -->
	{#each data as d, i}
		{@const [px, py] = pt(θ(i), maxR * d.value)}
		{@const on = allSelected || selectedAxes.has(d.label)}
		{#if d.boostStars > 0}
			<circle
				cx={px}
				cy={py}
				r="9"
				fill="none"
				stroke="var(--color-accent)"
				stroke-width="1.5"
				stroke-dasharray="3 2"
				opacity={on ? 0.5 : 0.1}
			/>
		{/if}
		<circle cx={px} cy={py} r="4.5" fill="var(--color-accent)" opacity={on ? 1 : 0.2} />
	{/each}

	<!-- Labels (clickable) -->
	{#each data as d, i}
		{@const pos = labelPos(i)}
		{@const on = selectedAxes.has(d.label)}
		{@const stars = d.boostStars > 0 ? ' ' + '✦'.repeat(d.boostStars) : ''}
		<g
			class="axis-label-group"
			class:is-active={!allSelected && on}
			class:is-dimmed={!on}
			onclick={() => onAxisClick?.(d.label)}
			role="button"
			tabindex="0"
			aria-label="{on ? 'Deselect' : 'Select'} {d.label}"
			aria-pressed={on}
			onkeydown={(e) => e.key === 'Enter' && onAxisClick?.(d.label)}
		>
			<text x={pos.x} y={pos.y - 7} text-anchor={pos.anchor} class="lbl-axis">
				{d.label}{stars}
			</text>
			<text x={pos.x} y={pos.y + 9} text-anchor={pos.anchor} class="lbl-count">
				{d.projectCount} projects
			</text>
		</g>
	{/each}
</svg>

<style>
	.radar {
		width: 100%;
		max-width: 540px;
		height: auto;
		overflow: visible;
	}

	.axis-label-group {
		cursor: pointer;
		transition: opacity 0.2s ease;
	}

	.axis-label-group.is-dimmed {
		opacity: 0.25;
	}

	.axis-label-group:hover .lbl-axis,
	.axis-label-group.is-active .lbl-axis {
		fill: var(--color-accent);
	}

	.lbl-axis {
		font-family: var(--font-body);
		font-size: 13px;
		font-weight: 600;
		fill: var(--color-charcoal);
		dominant-baseline: middle;
		transition: fill 0.2s ease;
	}

	.lbl-count {
		font-family: var(--font-mono);
		font-size: 9.5px;
		fill: var(--color-muted);
		letter-spacing: 0.05em;
		dominant-baseline: middle;
	}
</style>
