export type ProjectOrigin = 'Personal' | 'University' | 'Professional';
export type ProjectStatus = 'Complete' | 'In Progress' | 'Archived';
export type ProjectCardSize = '' | 'large' | 'wide' | 'tall';

export interface ProjectFrontmatter {
	order: number;
	title: string;
	slug: string;
	desc: string;
	origin: ProjectOrigin;
	status: ProjectStatus;
	tags: string[];
	tech: string[];
	sourceUrl?: string;
	gradient: string;
	cardSize: ProjectCardSize;
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
	order: number;
	slug: string;
	title: string;
	desc: string;
	origin: ProjectOrigin;
	tags: string[];
	status: ProjectStatus;
	tech: string[];
	sourceUrl?: string;
	gradient: string;
	size: ProjectCardSize;
}

export interface ProjectEntry {
	project: Project;
	frontmatter: ProjectFrontmatter;
	html: string;
}
