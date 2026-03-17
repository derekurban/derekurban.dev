export const projectThemeNames = [
	'teal',
	'sky',
	'seafoam',
	'rose',
	'blue',
	'emerald',
	'indigo',
	'sage',
	'violet',
	'sand',
	'amber',
	'slate',
	'clay',
	'coral',
	'glacier',
	'plum',
	'ochre',
	'cocoa'
] as const;

export type ProjectThemeName = (typeof projectThemeNames)[number];

interface ProjectTheme {
	surface: string;
	surfaceSoft: string;
	glow: string;
	accent: string;
	plate: string;
	plateBorder: string;
}

export const projectThemes: Record<ProjectThemeName, ProjectTheme> = {
	teal: {
		surface: '#6f97a2',
		surfaceSoft: '#8db2bc',
		glow: 'rgba(232, 245, 247, 0.34)',
		accent: '#466a74',
		plate: 'rgba(245, 251, 250, 0.3)',
		plateBorder: 'rgba(255, 255, 255, 0.16)'
	},
	sky: {
		surface: '#8eaec0',
		surfaceSoft: '#b2cad6',
		glow: 'rgba(244, 249, 252, 0.34)',
		accent: '#5b7988',
		plate: 'rgba(246, 250, 252, 0.32)',
		plateBorder: 'rgba(255, 255, 255, 0.16)'
	},
	seafoam: {
		surface: '#6f9c92',
		surfaceSoft: '#97b7af',
		glow: 'rgba(241, 248, 245, 0.32)',
		accent: '#477066',
		plate: 'rgba(244, 250, 247, 0.3)',
		plateBorder: 'rgba(255, 255, 255, 0.15)'
	},
	rose: {
		surface: '#a87e89',
		surfaceSoft: '#c4a0aa',
		glow: 'rgba(250, 243, 246, 0.32)',
		accent: '#7b5762',
		plate: 'rgba(250, 244, 246, 0.28)',
		plateBorder: 'rgba(255, 255, 255, 0.15)'
	},
	blue: {
		surface: '#7796bb',
		surfaceSoft: '#9db6d6',
		glow: 'rgba(243, 247, 252, 0.34)',
		accent: '#4f6c90',
		plate: 'rgba(245, 248, 252, 0.3)',
		plateBorder: 'rgba(255, 255, 255, 0.16)'
	},
	emerald: {
		surface: '#759b86',
		surfaceSoft: '#9ec0af',
		glow: 'rgba(243, 249, 246, 0.33)',
		accent: '#4f715f',
		plate: 'rgba(244, 250, 247, 0.29)',
		plateBorder: 'rgba(255, 255, 255, 0.15)'
	},
	indigo: {
		surface: '#7b89b1',
		surfaceSoft: '#a0accd',
		glow: 'rgba(244, 246, 252, 0.34)',
		accent: '#566285',
		plate: 'rgba(245, 247, 252, 0.3)',
		plateBorder: 'rgba(255, 255, 255, 0.16)'
	},
	sage: {
		surface: '#8ea483',
		surfaceSoft: '#b2c0aa',
		glow: 'rgba(245, 249, 243, 0.32)',
		accent: '#607055',
		plate: 'rgba(247, 250, 245, 0.28)',
		plateBorder: 'rgba(255, 255, 255, 0.15)'
	},
	violet: {
		surface: '#897ca4',
		surfaceSoft: '#aca1c1',
		glow: 'rgba(247, 244, 250, 0.32)',
		accent: '#635875',
		plate: 'rgba(248, 245, 250, 0.29)',
		plateBorder: 'rgba(255, 255, 255, 0.15)'
	},
	sand: {
		surface: '#a79579',
		surfaceSoft: '#c5b69d',
		glow: 'rgba(250, 247, 241, 0.28)',
		accent: '#75664f',
		plate: 'rgba(250, 247, 242, 0.28)',
		plateBorder: 'rgba(255, 255, 255, 0.13)'
	},
	amber: {
		surface: '#c89660',
		surfaceSoft: '#dfb183',
		glow: 'rgba(252, 247, 240, 0.26)',
		accent: '#915f2f',
		plate: 'rgba(251, 247, 241, 0.27)',
		plateBorder: 'rgba(255, 255, 255, 0.13)'
	},
	slate: {
		surface: '#7e96aa',
		surfaceSoft: '#a0b4c5',
		glow: 'rgba(243, 247, 250, 0.32)',
		accent: '#566a7c',
		plate: 'rgba(245, 248, 251, 0.29)',
		plateBorder: 'rgba(255, 255, 255, 0.15)'
	},
	clay: {
		surface: '#ab8f81',
		surfaceSoft: '#c8b0a4',
		glow: 'rgba(250, 245, 242, 0.3)',
		accent: '#7c6458',
		plate: 'rgba(250, 246, 243, 0.28)',
		plateBorder: 'rgba(255, 255, 255, 0.14)'
	},
	coral: {
		surface: '#bf8777',
		surfaceSoft: '#d9a99b',
		glow: 'rgba(251, 244, 241, 0.3)',
		accent: '#8a5d50',
		plate: 'rgba(251, 246, 243, 0.28)',
		plateBorder: 'rgba(255, 255, 255, 0.14)'
	},
	glacier: {
		surface: '#7fa5b1',
		surfaceSoft: '#a7c5cf',
		glow: 'rgba(243, 248, 250, 0.33)',
		accent: '#587784',
		plate: 'rgba(245, 249, 251, 0.29)',
		plateBorder: 'rgba(255, 255, 255, 0.15)'
	},
	plum: {
		surface: '#8d7899',
		surfaceSoft: '#b09dbc',
		glow: 'rgba(248, 244, 250, 0.31)',
		accent: '#65586e',
		plate: 'rgba(248, 245, 250, 0.29)',
		plateBorder: 'rgba(255, 255, 255, 0.15)'
	},
	ochre: {
		surface: '#b2905d',
		surfaceSoft: '#cfb083',
		glow: 'rgba(251, 247, 240, 0.28)',
		accent: '#80663a',
		plate: 'rgba(251, 247, 241, 0.27)',
		plateBorder: 'rgba(255, 255, 255, 0.13)'
	},
	cocoa: {
		surface: '#9b8377',
		surfaceSoft: '#bda59a',
		glow: 'rgba(249, 245, 242, 0.29)',
		accent: '#6f5a50',
		plate: 'rgba(250, 246, 243, 0.28)',
		plateBorder: 'rgba(255, 255, 255, 0.14)'
	}
};

export function getProjectTheme(themeName: ProjectThemeName | undefined): ProjectTheme {
	return projectThemes[themeName ?? 'teal'] ?? projectThemes.teal;
}
