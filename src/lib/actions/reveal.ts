export function reveal(node: HTMLElement, options?: { delay?: number; skip?: boolean }) {
	const delay = options?.delay ?? 0;
	const skip = options?.skip ?? false;

	node.style.setProperty('--reveal-delay', `${delay}ms`);

	if (skip) {
		node.classList.add('visible');
		return { destroy() {} };
	}

	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		node.classList.add('visible');
		return { destroy() {} };
	}

	let frame = 0;

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					frame = window.requestAnimationFrame(() => {
						node.classList.add('visible');
					});
					observer.unobserve(node);
				}
			});
		},
		{
			threshold: 0.18,
			rootMargin: '0px 0px 10% 0px'
		}
	);

	observer.observe(node);

	return {
		destroy() {
			if (frame) {
				window.cancelAnimationFrame(frame);
			}
			observer.disconnect();
		}
	};
}
