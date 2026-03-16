import type { ProjectThemeName } from '$lib/data/projectThemes';

export type ProjectOrigin = 'Personal' | 'University' | 'Professional';
export type ProjectStatus = 'Complete' | 'In Progress' | 'Archived';
export type ProjectCardForegroundStyle = 'title' | 'icon';

export interface ProjectFrontmatter {
	title: string;
	slug: string;
	desc: string;
	origin: ProjectOrigin;
	status: ProjectStatus;
	pinned: boolean;
	archived: boolean;
	tags: string[];
	tech: string[];
	sourceUrl?: string;
	cardTheme: ProjectThemeName;
	cardForeground?: string;
	cardForegroundStyle?: ProjectCardForegroundStyle;
	cardIconSize?: number;
	projectSize: string;
	skillLevel: string;
	capabilities: string[];
	startDate: string;
	endDate: string;
	duration: string;
	contributors: number;
	contribution: string;
}

export interface Project {
	slug: string;
	title: string;
	desc: string;
	origin: ProjectOrigin;
	tags: string[];
	status: ProjectStatus;
	pinned: boolean;
	archived: boolean;
	tech: string[];
	sourceUrl?: string;
	cardTheme: ProjectThemeName;
	cardForeground?: string;
	cardForegroundStyle?: ProjectCardForegroundStyle;
	cardIconSize?: number;
}

export interface ProjectEntry {
	project: Project;
	frontmatter: ProjectFrontmatter;
	html: string;
}
