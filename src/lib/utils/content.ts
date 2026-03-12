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
				return `<figure class="diagram-figure">
					<img src="${resolvedHref}" alt="${caption}" loading="lazy" />
					${caption ? `<figcaption>${caption}</figcaption>` : ''}
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

	return {
		frontmatter: frontmatter as ProjectFrontmatter,
		html
	};
}
