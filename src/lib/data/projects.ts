import type { Project, ProjectEntry, ProjectFrontmatter } from '$lib/types/project';
import { parseProjectContent } from '$lib/utils/content';

const contentModules = import.meta.glob('/src/content/projects/**/POST.md', {
	query: '?raw',
	import: 'default',
	eager: true
}) as Record<string, string>;

const assetModules = import.meta.glob(
	'/src/content/projects/**/assets/**/*.{png,jpg,jpeg,webp,avif,gif,svg}',
	{
		query: '?url',
		import: 'default',
		eager: true
	}
) as Record<string, string>;

function assertProjectFrontmatter(
	frontmatter: Partial<ProjectFrontmatter>,
	contentPath: string
): asserts frontmatter is ProjectFrontmatter {
	const requiredFields: Array<keyof ProjectFrontmatter> = [
		'title',
		'slug',
		'desc',
		'origin',
		'status',
		'pinned',
		'cardTheme',
		'tags',
		'tech',
		'projectSize',
		'skillLevel',
		'capabilities',
		'startDate',
		'endDate',
		'duration',
		'contributors',
		'contribution'
	];

	for (const field of requiredFields) {
		if (frontmatter[field] === undefined) {
			throw new Error(`Missing "${field}" in project frontmatter: ${contentPath}`);
		}
	}

	if (frontmatter.origin === 'University' && !frontmatter.sourceUrl) {
		throw new Error(`Missing "sourceUrl" in university project frontmatter: ${contentPath}`);
	}
}

function toProject(frontmatter: ProjectFrontmatter): Project {
	return {
		slug: frontmatter.slug,
		title: frontmatter.title,
		desc: frontmatter.desc,
		origin: frontmatter.origin,
		tags: frontmatter.tags,
		status: frontmatter.status,
		pinned: frontmatter.pinned,
		tech: frontmatter.tech,
		sourceUrl: frontmatter.sourceUrl,
		cardTheme: frontmatter.cardTheme,
		cardForeground: frontmatter.cardForeground,
		cardForegroundStyle: frontmatter.cardForegroundStyle,
		cardIconSize: frontmatter.cardIconSize
	};
}

export const projectEntries: ProjectEntry[] = Object.entries(contentModules)
	.map(([contentPath, raw]) => {
		const { frontmatter, html } = parseProjectContent(raw, {
			contentPath,
			assetUrls: assetModules
		});

		assertProjectFrontmatter(frontmatter, contentPath);

		return {
			project: toProject(frontmatter),
			frontmatter,
			html
		};
	})
	.sort((a, b) => {
		const pinnedOrder = Number(b.frontmatter.pinned) - Number(a.frontmatter.pinned);
		if (pinnedOrder !== 0) {
			return pinnedOrder;
		}

		const aEnd = Date.parse(a.frontmatter.endDate);
		const bEnd = Date.parse(b.frontmatter.endDate);
		return bEnd - aEnd || a.project.title.localeCompare(b.project.title);
	});

export const projects: Project[] = projectEntries.map((entry) => entry.project);

const projectEntriesBySlug = new Map(projectEntries.map((entry) => [entry.project.slug, entry]));

export function getProjectEntryBySlug(slug: string): ProjectEntry | undefined {
	return projectEntriesBySlug.get(slug);
}
