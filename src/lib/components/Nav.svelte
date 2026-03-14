<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { Github, Linkedin, Monitor, MoonStar, SunMedium } from 'lucide-svelte';

	type ThemeMode = 'system' | 'light' | 'dark';

	const githubUrl = 'https://github.com/derekurban';
	const linkedinUrl = 'https://www.linkedin.com/in/derekurban/';

	let themeMode = $state<ThemeMode>('system');

	function applyTheme(mode: ThemeMode) {
		const root = document.documentElement;
		themeMode = mode;

		if (mode === 'system') {
			root.removeAttribute('data-theme');
			window.localStorage.removeItem('theme');
			return;
		}

		root.dataset.theme = mode;
		window.localStorage.setItem('theme', mode);
	}

	function cycleTheme() {
		if (themeMode === 'system') {
			applyTheme('light');
			return;
		}

		if (themeMode === 'light') {
			applyTheme('dark');
			return;
		}

		applyTheme('system');
	}

	onMount(() => {
		const storedTheme = window.localStorage.getItem('theme');

		if (storedTheme === 'light' || storedTheme === 'dark') {
			applyTheme(storedTheme);
			return;
		}

		applyTheme('system');
	});

	let isProjectsRoute = $derived(
		page.url.pathname === '/' || page.url.pathname.startsWith('/projects/')
	);
	let themeLabel = $derived(
		themeMode === 'system'
			? 'System'
			: themeMode === 'light'
				? 'Light'
				: 'Dark'
	);
</script>

<nav class="site-nav">
	<a class="site-brand" href="/">Derek Urban</a>

	<div class="site-nav-actions">
		<a class:nav-link-active={isProjectsRoute} class="nav-link" href="/">Projects</a>

		<div class="nav-divider" aria-hidden="true"></div>

		<a
			class="nav-icon-link"
			href={githubUrl}
			target="_blank"
			rel="noreferrer"
			aria-label="GitHub"
			title="GitHub"
		>
			<Github size={16} strokeWidth={1.85} />
		</a>

		<a
			class="nav-icon-link"
			href={linkedinUrl}
			target="_blank"
			rel="noreferrer"
			aria-label="LinkedIn"
			title="LinkedIn"
		>
			<Linkedin size={16} strokeWidth={1.85} />
		</a>

		<button
			type="button"
			class="theme-toggle"
			onclick={cycleTheme}
			aria-label={`Cycle theme. Current mode: ${themeLabel}`}
			title={`Theme: ${themeLabel}`}
		>
			<span class="theme-toggle-icon" aria-hidden="true">
				{#if themeMode === 'light'}
					<SunMedium size={16} strokeWidth={1.9} />
				{:else if themeMode === 'dark'}
					<MoonStar size={16} strokeWidth={1.9} />
				{:else}
					<Monitor size={16} strokeWidth={1.9} />
				{/if}
			</span>
			<span class="theme-toggle-label">{themeLabel}</span>
		</button>
	</div>
</nav>

<style>
	.site-nav {
		position: fixed;
		inset: 0 0 auto;
		z-index: 100;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.85rem 2rem;
		border-bottom: var(--border-w) solid var(--color-line);
		backdrop-filter: blur(16px);
		background: var(--nav-bg);
	}

	.site-brand {
		font-family: var(--font-display);
		font-size: 1.3rem;
		font-weight: 500;
		letter-spacing: -0.03em;
		color: var(--color-charcoal);
		text-decoration: none;
	}

	.site-nav-actions {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 0.55rem;
	}

	.nav-link,
	.nav-icon-link,
	.theme-toggle {
		border: 1px solid transparent;
		background: transparent;
		color: var(--color-medium);
		transition:
			transform 0.2s var(--ease-out-expo),
			border-color 0.2s var(--ease-out-expo),
			background 0.2s var(--ease-out-expo),
			color 0.2s var(--ease-out-expo);
	}

	.nav-link {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 2.4rem;
		padding: 0 0.85rem;
		border-radius: 999px;
		font-family: var(--font-mono);
		font-size: 0.64rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		text-decoration: none;
	}

	.nav-link:hover,
	.nav-icon-link:hover,
	.theme-toggle:hover {
		border-color: var(--color-line);
		background: var(--glass);
		color: var(--color-charcoal);
		transform: translateY(-1px);
	}

	.nav-link-active {
		border-color: var(--color-line);
		background: var(--glass);
		color: var(--color-charcoal);
	}

	.nav-divider {
		width: 1px;
		height: 1.6rem;
		background: var(--color-line);
		margin: 0 0.05rem;
	}

	.nav-icon-link,
	.theme-toggle {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 2.4rem;
		border-radius: 999px;
	}

	.nav-icon-link {
		width: 2.4rem;
		text-decoration: none;
	}

	.theme-toggle {
		gap: 0.42rem;
		padding: 0 0.8rem 0 0.72rem;
		cursor: pointer;
		font-family: var(--font-mono);
		font-size: 0.62rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}

	.theme-toggle-label {
		line-height: 1;
	}

	.theme-toggle-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}

	@media (max-width: 700px) {
		.site-nav {
			padding: 0.75rem 1rem;
		}

		.site-brand {
			font-size: 1.08rem;
		}

		.site-nav-actions {
			gap: 0.38rem;
		}

		.nav-link {
			display: none;
		}

		.nav-divider {
			display: none;
		}

		.theme-toggle {
			padding-right: 0.72rem;
		}

		.theme-toggle-label {
			display: none;
		}
	}
</style>
