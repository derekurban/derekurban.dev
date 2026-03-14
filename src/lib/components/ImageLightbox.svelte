<script lang="ts">
	import { tick } from 'svelte';
	import { X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-svelte';

	type ZoomableImage = {
		src: string;
		alt: string;
		caption: string;
	};

	const MIN_SCALE = 1;
	const MAX_SCALE = 5;

	let { container = null }: { container?: HTMLElement | null } = $props();

	let activeImage = $state<ZoomableImage | null>(null);
	let scale = $state(MIN_SCALE);
	let offset = $state({ x: 0, y: 0 });
	let naturalSize = $state({ width: 0, height: 0 });
	let isDragging = $state(false);

	let panel = $state<HTMLDivElement | null>(null);
	let stage = $state<HTMLDivElement | null>(null);

	let pointers = new Map<number, { x: number; y: number }>();
	let dragOrigin = { x: 0, y: 0 };
	let offsetOrigin = { x: 0, y: 0 };
	let pinchStartDistance = 0;
	let pinchStartScale = MIN_SCALE;

	function clamp(value: number, min: number, max: number): number {
		return Math.min(Math.max(value, min), max);
	}

	function resetTransform(): void {
		scale = MIN_SCALE;
		offset = { x: 0, y: 0 };
		pinchStartDistance = 0;
		pinchStartScale = MIN_SCALE;
		isDragging = false;
	}

	function getImageFromTrigger(trigger: HTMLElement): ZoomableImage | null {
		const src = trigger.dataset.imageSrc;
		if (!src) return null;

		return {
			src,
			alt: trigger.dataset.imageAlt ?? '',
			caption: trigger.dataset.imageCaption ?? ''
		};
	}

	function getViewportFit(): { width: number; height: number } {
		if (!stage || !naturalSize.width || !naturalSize.height) {
			return { width: 0, height: 0 };
		}

		const fit = Math.min(stage.clientWidth / naturalSize.width, stage.clientHeight / naturalSize.height);

		return {
			width: naturalSize.width * fit,
			height: naturalSize.height * fit
		};
	}

	function clampOffset(nextOffset: { x: number; y: number }, nextScale = scale): { x: number; y: number } {
		if (nextScale <= MIN_SCALE || !stage) {
			return { x: 0, y: 0 };
		}

		const { width, height } = getViewportFit();
		const maxX = Math.max(0, (width * nextScale - stage.clientWidth) / 2);
		const maxY = Math.max(0, (height * nextScale - stage.clientHeight) / 2);

		return {
			x: clamp(nextOffset.x, -maxX, maxX),
			y: clamp(nextOffset.y, -maxY, maxY)
		};
	}

	function setScale(nextScale: number): void {
		const clampedScale = clamp(nextScale, MIN_SCALE, MAX_SCALE);
		scale = clampedScale;
		offset = clampOffset(offset, clampedScale);
	}

	function zoomAtPoint(nextScale: number, clientX?: number, clientY?: number): void {
		if (clientX === undefined || clientY === undefined || !stage || scale === nextScale) {
			setScale(nextScale);
			return;
		}

		const clampedScale = clamp(nextScale, MIN_SCALE, MAX_SCALE);
		const rect = stage.getBoundingClientRect();
		const focalX = clientX - rect.left - rect.width / 2 - offset.x;
		const focalY = clientY - rect.top - rect.height / 2 - offset.y;
		const scaleRatio = clampedScale / scale;
		const nextOffset = {
			x: offset.x - focalX * (scaleRatio - 1),
			y: offset.y - focalY * (scaleRatio - 1)
		};

		scale = clampedScale;
		offset = clampOffset(nextOffset, clampedScale);
	}

	async function openImage(payload: ZoomableImage): Promise<void> {
		activeImage = payload;
		naturalSize = { width: 0, height: 0 };
		resetTransform();
		await tick();
		panel?.focus();
	}

	function closeImage(): void {
		activeImage = null;
		naturalSize = { width: 0, height: 0 };
		pointers.clear();
		resetTransform();
	}

	function adjustZoom(delta: number): void {
		setScale(Number((scale + delta).toFixed(2)));
	}

	function handleKeydown(event: KeyboardEvent): void {
		if (!activeImage) return;

		if (event.key === 'Escape') {
			closeImage();
			return;
		}

		if (event.key === '+' || event.key === '=') {
			event.preventDefault();
			adjustZoom(0.35);
			return;
		}

		if (event.key === '-') {
			event.preventDefault();
			adjustZoom(-0.35);
			return;
		}

		if (event.key === '0') {
			event.preventDefault();
			resetTransform();
		}
	}

	function handleResize(): void {
		offset = clampOffset(offset);
	}

	function handleImageLoad(event: Event): void {
		const image = event.currentTarget as HTMLImageElement;
		naturalSize = {
			width: image.naturalWidth,
			height: image.naturalHeight
		};
		offset = clampOffset(offset);
	}

	function handleWheel(event: WheelEvent): void {
		if (!activeImage) return;
		event.preventDefault();
		const delta = event.deltaY < 0 ? 0.22 : -0.22;
		zoomAtPoint(Number((scale + delta).toFixed(2)), event.clientX, event.clientY);
	}

	function getPointerDistance(): number {
		const [a, b] = [...pointers.values()];
		if (!a || !b) return 0;
		return Math.hypot(a.x - b.x, a.y - b.y);
	}

	function getPointerMidpoint(): { x: number; y: number } {
		const [a, b] = [...pointers.values()];
		if (!a || !b) return { x: 0, y: 0 };
		return {
			x: (a.x + b.x) / 2,
			y: (a.y + b.y) / 2
		};
	}

	function handlePointerdown(event: PointerEvent): void {
		if (!activeImage) return;
		if (event.pointerType === 'mouse' && event.button !== 0) return;

		stage?.setPointerCapture(event.pointerId);
		pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

		if (pointers.size === 1) {
			dragOrigin = { x: event.clientX, y: event.clientY };
			offsetOrigin = { ...offset };
			isDragging = scale > MIN_SCALE;
		}

		if (pointers.size === 2) {
			pinchStartDistance = getPointerDistance();
			pinchStartScale = scale;
			isDragging = false;
		}
	}

	function handlePointermove(event: PointerEvent): void {
		if (!activeImage || !pointers.has(event.pointerId)) return;

		pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

		if (pointers.size === 2 && pinchStartDistance) {
			const distance = getPointerDistance();
			const midpoint = getPointerMidpoint();
			zoomAtPoint(pinchStartScale * (distance / pinchStartDistance), midpoint.x, midpoint.y);
			offsetOrigin = { ...offset };
			return;
		}

		if (pointers.size === 1 && scale > MIN_SCALE) {
			const pointer = pointers.get(event.pointerId);
			if (!pointer) return;

			offset = clampOffset({
				x: offsetOrigin.x + pointer.x - dragOrigin.x,
				y: offsetOrigin.y + pointer.y - dragOrigin.y
			});
			isDragging = true;
		}
	}

	function handlePointerup(event: PointerEvent): void {
		if (pointers.has(event.pointerId)) {
			pointers.delete(event.pointerId);
		}

		stage?.releasePointerCapture(event.pointerId);

		if (pointers.size < 2) {
			pinchStartDistance = 0;
			pinchStartScale = scale;
		}

		if (pointers.size === 1) {
			const [remaining] = [...pointers.values()];
			if (remaining) {
				dragOrigin = { ...remaining };
				offsetOrigin = { ...offset };
			}
		} else {
			isDragging = false;
		}
	}

	$effect(() => {
		const root = container;
		if (!root) return;

		const handleClick = (event: MouseEvent) => {
			const trigger = (event.target as HTMLElement | null)?.closest('[data-zoomable-image]');
			if (!(trigger instanceof HTMLElement) || !root.contains(trigger)) {
				return;
			}

			event.preventDefault();
			const payload = getImageFromTrigger(trigger);
			if (payload) {
				void openImage(payload);
			}
		};

		root.addEventListener('click', handleClick);

		return () => {
			root.removeEventListener('click', handleClick);
		};
	});

	$effect(() => {
		if (!activeImage) return;

		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';

		return () => {
			document.body.style.overflow = previousOverflow;
		};
	});
</script>

<svelte:window onkeydown={handleKeydown} onresize={handleResize} />

{#if activeImage}
	<div class="lightbox-root" aria-hidden="false">
		<button type="button" class="lightbox-backdrop" aria-label="Close expanded image" onclick={closeImage}></button>

		<div
			bind:this={panel}
			class="lightbox-panel"
			role="dialog"
			aria-modal="true"
			aria-label={activeImage.caption || activeImage.alt || 'Expanded project image'}
			tabindex="-1"
		>
			<div class="lightbox-header">
				<div class="lightbox-meta">
					<p class="lightbox-kicker">Diagram Viewer</p>
					<p class="lightbox-caption">{activeImage.caption || activeImage.alt || 'Expanded image'}</p>
				</div>

				<button type="button" class="lightbox-close" onclick={closeImage}>
					<X size={18} strokeWidth={2} />
				</button>
			</div>

			<div
				bind:this={stage}
				class:lightbox-stage-dragging={isDragging}
				class="lightbox-stage"
				role="group"
				aria-label="Expanded image viewport"
				onwheel={handleWheel}
				onpointerdown={handlePointerdown}
				onpointermove={handlePointermove}
				onpointerup={handlePointerup}
				onpointercancel={handlePointerup}
			>
				<div class="lightbox-image-frame" style={`transform: translate3d(${offset.x}px, ${offset.y}px, 0);`}>
					<img
						src={activeImage.src}
						alt={activeImage.alt}
						class="lightbox-image"
						style={`transform: scale(${scale});`}
						draggable="false"
						onload={handleImageLoad}
					/>
				</div>
			</div>

			<div class="lightbox-toolbar">
				<p class="lightbox-hint">Pinch, scroll, or use the controls. Drag to pan when zoomed.</p>

				<div class="lightbox-controls">
					<button type="button" class="lightbox-control" aria-label="Zoom out" onclick={() => adjustZoom(-0.35)}>
						<ZoomOut size={15} strokeWidth={2} />
					</button>
					<button type="button" class="lightbox-control lightbox-control-reset" onclick={resetTransform}>
						<RotateCcw size={15} strokeWidth={2} />
						Reset
					</button>
					<button type="button" class="lightbox-control" aria-label="Zoom in" onclick={() => adjustZoom(0.35)}>
						<ZoomIn size={15} strokeWidth={2} />
					</button>
					<div class="lightbox-scale">{Math.round(scale * 100)}%</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.lightbox-root {
		position: fixed;
		inset: 0;
		z-index: 160;
	}

	.lightbox-backdrop {
		position: absolute;
		inset: 0;
		border: none;
		background:
			radial-gradient(circle at top, rgba(192, 166, 84, 0.12), transparent 32%),
			rgba(17, 16, 14, 0.84);
		backdrop-filter: blur(18px);
	}

	.lightbox-panel {
		position: absolute;
		inset: clamp(0.75rem, 2vw, 1.5rem);
		display: grid;
		grid-template-rows: auto minmax(0, 1fr) auto;
		gap: 1rem;
		padding: clamp(0.9rem, 2vw, 1.4rem);
		border: 1px solid rgba(255, 250, 240, 0.12);
		border-radius: 26px;
		background:
			linear-gradient(180deg, rgba(36, 33, 29, 0.96), rgba(20, 18, 16, 0.94)),
			radial-gradient(circle at top, rgba(192, 166, 84, 0.15), transparent 40%);
		box-shadow: 0 32px 80px rgba(0, 0, 0, 0.35);
		color: #f4efe4;
		outline: none;
	}

	.lightbox-header,
	.lightbox-toolbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}

	.lightbox-kicker {
		font-family: var(--font-mono);
		font-size: 0.62rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: rgba(244, 239, 228, 0.62);
	}

	.lightbox-caption {
		font-size: clamp(0.95rem, 1.4vw, 1.08rem);
		line-height: 1.5;
		color: #f8f5ef;
	}

	.lightbox-close,
	.lightbox-control {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.45rem;
		border: 1px solid rgba(255, 250, 240, 0.12);
		border-radius: 999px;
		background: rgba(255, 250, 240, 0.08);
		color: inherit;
		cursor: pointer;
		transition:
			transform 0.18s var(--ease-out-expo),
			background 0.18s var(--ease-out-expo),
			border-color 0.18s var(--ease-out-expo);
	}

	.lightbox-close:hover,
	.lightbox-control:hover {
		transform: translateY(-1px);
		border-color: rgba(255, 250, 240, 0.22);
		background: rgba(255, 250, 240, 0.14);
	}

	.lightbox-close {
		width: 2.75rem;
		height: 2.75rem;
		flex-shrink: 0;
	}

	.lightbox-stage {
		position: relative;
		display: grid;
		place-items: center;
		min-height: 0;
		overflow: hidden;
		border-radius: 20px;
		background:
			linear-gradient(135deg, rgba(255, 250, 240, 0.06), rgba(255, 250, 240, 0.02)),
			repeating-linear-gradient(
				45deg,
				rgba(255, 250, 240, 0.03) 0,
				rgba(255, 250, 240, 0.03) 12px,
				transparent 12px,
				transparent 24px
			);
		border: 1px solid rgba(255, 250, 240, 0.08);
		touch-action: none;
		cursor: grab;
	}

	.lightbox-stage-dragging {
		cursor: grabbing;
	}

	.lightbox-image-frame {
		display: grid;
		place-items: center;
		will-change: transform;
	}

	.lightbox-image {
		max-width: 100%;
		max-height: min(72vh, 100%);
		border-radius: 16px;
		box-shadow:
			0 24px 60px rgba(0, 0, 0, 0.28),
			0 0 0 1px rgba(255, 250, 240, 0.1);
		transform-origin: center center;
		will-change: transform;
		user-select: none;
		pointer-events: none;
		background: rgba(255, 250, 240, 0.94);
	}

	.lightbox-toolbar {
		flex-wrap: wrap;
	}

	.lightbox-hint {
		font-size: 0.84rem;
		color: rgba(244, 239, 228, 0.7);
	}

	.lightbox-controls {
		display: inline-flex;
		align-items: center;
		flex-wrap: wrap;
		justify-content: flex-end;
		gap: 0.55rem;
	}

	.lightbox-control {
		min-height: 2.6rem;
		padding: 0 0.95rem;
	}

	.lightbox-control-reset {
		font-family: var(--font-mono);
		font-size: 0.68rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.lightbox-scale {
		min-width: 4.3rem;
		padding: 0.72rem 0.95rem;
		border-radius: 999px;
		background: rgba(255, 250, 240, 0.08);
		border: 1px solid rgba(255, 250, 240, 0.08);
		font-family: var(--font-mono);
		font-size: 0.68rem;
		letter-spacing: 0.08em;
		text-align: center;
	}

	@media (max-width: 720px) {
		.lightbox-panel {
			inset: 0.6rem;
			border-radius: 22px;
		}

		.lightbox-header,
		.lightbox-toolbar {
			align-items: flex-start;
			flex-direction: column;
		}

		.lightbox-controls {
			width: 100%;
			justify-content: space-between;
		}

		.lightbox-scale {
			flex: 1 0 auto;
		}
	}
</style>
