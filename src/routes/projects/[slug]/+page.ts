import { getProjectEntryBySlug } from '$lib/data/projects';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const entry = getProjectEntryBySlug(params.slug);
	if (!entry) throw error(404, 'Project not found');

	return { project: entry.project, content: entry.html, meta: entry.frontmatter };
};
