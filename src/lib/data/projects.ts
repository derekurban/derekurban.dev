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
		'archived',
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
		archived: frontmatter.archived,
		tech: frontmatter.tech,
		sourceUrl: frontmatter.sourceUrl,
		cardTheme: frontmatter.cardTheme,
		cardForeground: frontmatter.cardForeground,
		cardForegroundStyle: frontmatter.cardForegroundStyle,
		cardIconSize: frontmatter.cardIconSize
	};
}

function toSortableDate(value: string): number {
	const parsed = Date.parse(value);
	return Number.isNaN(parsed) ? Number.NEGATIVE_INFINITY : parsed;
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

		const aEnd = toSortableDate(a.frontmatter.endDate);
		const bEnd = toSortableDate(b.frontmatter.endDate);
		return bEnd - aEnd || a.project.title.localeCompare(b.project.title);
	});

export const projects: Project[] = projectEntries.map((entry) => entry.project);

const projectEntriesBySlug = new Map(projectEntries.map((entry) => [entry.project.slug, entry]));

export function getProjectEntryBySlug(slug: string): ProjectEntry | undefined {
	return projectEntriesBySlug.get(slug);
}
