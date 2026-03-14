import { Marked } from 'marked';
import { parse as parseYaml } from 'yaml';
import type { ProjectFrontmatter } from '$lib/types/project';

interface ParseProjectContentOptions {
	contentPath?: string;
	assetUrls?: Record<string, string>;
}

interface ProjectContent {
	frontmatter: ProjectFrontmatter;
	html: string;
}

function escapeHtml(value: string): string {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;');
}

function parseFrontmatter(raw: string): { frontmatter: unknown; body: string } {
	const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
	if (!match) {
		return { frontmatter: {}, body: raw };
	}

	return {
		frontmatter: parseYaml(match[1]) ?? {},
		body: match[2]
	};
}

function isExternalHref(href: string): boolean {
	return /^(?:[a-z][a-z\d+.-]*:|\/\/|#|\/)/i.test(href);
}

function resolveRelativePath(fromFile: string, href: string): string {
	const segments = fromFile.replace(/\\/g, '/').split('/');
	segments.pop();

	for (const segment of href.split('/')) {
		if (!segment || segment === '.') continue;
		if (segment === '..') {
			segments.pop();
			continue;
		}

		segments.push(segment);
	}

	return segments.join('/');
}

function getDirectoryPath(filePath: string): string {
	const segments = filePath.replace(/\\/g, '/').split('/');
	segments.pop();
	return segments.join('/');
}

function resolveAssetHref(
	href: string,
	contentPath: string | undefined,
	assetUrls: Record<string, string>
): string {
	if (!contentPath || isExternalHref(href)) {
		return href;
	}

	const resolvedPath = resolveRelativePath(contentPath, href);
	return assetUrls[resolvedPath] ?? href;
}

function findProjectAssetPath(
	contentPath: string | undefined,
	assetUrls: Record<string, string>,
	candidates: string[]
): string | undefined {
	if (!contentPath) {
		return undefined;
	}

	const directoryPath = getDirectoryPath(contentPath);

	for (const candidate of candidates) {
		const assetPath = Object.keys(assetUrls).find((path) =>
			path.startsWith(`${directoryPath}/assets/${candidate}.`)
		);

		if (assetPath) {
			return assetPath;
		}
	}

	return undefined;
}

function inferForegroundStyle(
	cardForeground: string | undefined,
	explicitStyle: ProjectFrontmatter['cardForegroundStyle']
): ProjectFrontmatter['cardForegroundStyle'] {
	if (explicitStyle) {
		return explicitStyle;
	}

	if (!cardForeground) {
		return undefined;
	}

	return /(?:^|[-/])card-icon\./i.test(cardForeground) || /\.svg(?:$|\?)/i.test(cardForeground)
		? 'icon'
		: 'title';
}

function normalizeCardIconSize(value: unknown): number | undefined {
	if (typeof value === 'number' && Number.isFinite(value)) {
		return Math.min(100, Math.max(1, value));
	}

	if (typeof value === 'string') {
		const parsed = Number.parseFloat(value);
		if (Number.isFinite(parsed)) {
			return Math.min(100, Math.max(1, parsed));
		}
	}

	return undefined;
}

function resolveProjectFrontmatter(
	frontmatter: Partial<ProjectFrontmatter>,
	contentPath: string | undefined,
	assetUrls: Record<string, string>
): ProjectFrontmatter {
	const inferredAssetPath =
		typeof frontmatter.cardForeground === 'string'
			? isExternalHref(frontmatter.cardForeground) || !contentPath
				? frontmatter.cardForeground
				: resolveRelativePath(contentPath, frontmatter.cardForeground)
			: findProjectAssetPath(contentPath, assetUrls, ['card-icon', 'card-title']);
	const resolvedForeground =
		typeof frontmatter.cardForeground === 'string'
			? resolveAssetHref(frontmatter.cardForeground, contentPath, assetUrls)
			: inferredAssetPath
				? assetUrls[inferredAssetPath]
				: undefined;

	return {
		...frontmatter,
		cardForeground: resolvedForeground,
		cardIconSize: normalizeCardIconSize(frontmatter.cardIconSize),
		cardForegroundStyle: inferForegroundStyle(
			inferredAssetPath ?? frontmatter.cardForeground ?? resolvedForeground,
			frontmatter.cardForegroundStyle
		)
	} as ProjectFrontmatter;
}

/**
 * Create a configured Marked instance with custom image rendering.
 */
function createRenderer(resolveHref?: (href: string) => string): Marked {
	const marked = new Marked();

	marked.use({
		renderer: {
			image({ href, title, text }: { href: string; title: string | null; text: string }) {
				const resolvedHref = resolveHref?.(href) ?? href;
				const caption = text || title || '';
				const safeSrc = escapeHtml(resolvedHref);
				const safeCaption = escapeHtml(caption);
				const safeLabel = escapeHtml(caption ? `Expand image: ${caption}` : 'Expand image');
				return `<figure class="diagram-figure">
					<button
						type="button"
						class="diagram-trigger"
						data-zoomable-image
						data-image-src="${safeSrc}"
						data-image-alt="${safeCaption}"
						data-image-caption="${safeCaption}"
						aria-label="${safeLabel}"
					>
						<img src="${safeSrc}" alt="${safeCaption}" loading="lazy" />
						<span class="diagram-trigger-badge">Tap to inspect</span>
					</button>
					${caption ? `<figcaption>${safeCaption}</figcaption>` : ''}
				</figure>`;
			}
		}
	});

	return marked;
}

/**
 * Parse a raw markdown string (with frontmatter) into structured project content.
 */
export function parseProjectContent(
	raw: string,
	{ contentPath, assetUrls = {} }: ParseProjectContentOptions = {}
): ProjectContent {
	const { frontmatter, body } = parseFrontmatter(raw);
	const marked = createRenderer((href) => resolveAssetHref(href, contentPath, assetUrls));
	const html = marked.parse(body) as string;
	const resolvedFrontmatter = resolveProjectFrontmatter(
		frontmatter as Partial<ProjectFrontmatter>,
		contentPath,
		assetUrls
	);

	return {
		frontmatter: resolvedFrontmatter,
		html
	};
}
