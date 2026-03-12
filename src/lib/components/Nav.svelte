<nav
	class="fixed top-0 left-0 right-0 z-100 flex items-center justify-between border-b backdrop-blur-[16px]"
	style="padding: 0.85rem 2rem; background: var(--nav-bg); border-color: var(--color-line); border-width: var(--border-w);"
>
	<div class="font-display text-[1.3rem] tracking-[-0.03em] text-charcoal" style="font-weight: 500;">
		Derek Urban
	</div>
	<ul class="hidden gap-1.5 sm:flex" style="list-style: none;">
		<li>
			<a
				href="/"
				class="font-mono rounded-lg border border-transparent px-3 py-1.5 text-[0.64rem] uppercase tracking-[0.16em] text-medium transition-all duration-200 hover:border-line hover:text-charcoal"
				style="background: transparent;"
				onmouseenter={(e) => (e.currentTarget.style.background = 'var(--glass)')}
				onmouseleave={(e) => (e.currentTarget.style.background = 'transparent')}
			>
				Projects
			</a>
		</li>
	</ul>
</nav>
