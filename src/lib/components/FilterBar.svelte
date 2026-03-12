<script lang="ts">
	import { tagMeta, tagOrder } from '$lib/data/tags';

	interface Props {
		selectedTags: Set<string>;
		dormantTags: string[];
		onTagToggle: (tag: string) => void;
	}

	let { selectedTags, dormantTags, onTagToggle }: Props = $props();

	function chipState(tag: string): 'active' | 'dormant' | 'inactive' {
		if (selectedTags.has(tag)) return 'active';
		if (dormantTags.includes(tag)) return 'dormant';
		return 'inactive';
	}
</script>

<div class="filter-bar">
	{#each tagOrder as tag (tag)}
		{@const state = chipState(tag)}
		<button
			class="filter-chip chip-{state}"
			aria-pressed={state === 'active'}
			disabled={state === 'inactive'}
			onclick={() => onTagToggle(tag)}
		>
			{tagMeta[tag]?.label ?? tag}
		</button>
	{/each}
</div>

<style>
	.filter-bar {
		max-width: 1340px;
		margin: 0 auto 1.5rem;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.5rem;
		padding: 0 2rem;
		perspective: 600px;
	}

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

	/* ── Dormant: default resting state ── */
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

	/* ── Active: risen, popped out, 3D ── */
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

	/* ── Inactive: sunken, dotted, muted ── */
	.chip-inactive {
		background: transparent;
		border: var(--border-w) dashed var(--color-line);
		color: var(--color-muted);
		opacity: 0.5;
		cursor: default;
		transform: translateY(1px) translateZ(-4px) rotateX(1deg);
		box-shadow: none;
	}

	.chip-inactive:hover {
		opacity: 0.5;
	}

	@media (max-width: 700px) {
		.filter-bar {
			padding: 0 1rem;
			gap: 0.4rem;
		}
	}
</style>
