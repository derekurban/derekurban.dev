export function reveal(node: HTMLElement, options?: { delay?: number; skip?: boolean }) {
	const delay = options?.delay ?? 0;
	const skip = options?.skip ?? false;

	if (skip) {
		node.classList.add('visible');
		return { destroy() {} };
	}

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					setTimeout(() => {
						node.classList.add('visible');
					}, delay);
					observer.unobserve(node);
				}
			});
		},
		{ threshold: 0.08 }
	);

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
}
