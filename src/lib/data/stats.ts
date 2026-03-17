import { projectEntries } from './projects';
import type { ProjectFrontmatter } from '$lib/types/project';

export interface RadarAxis {
	label: string;
	description: string;
	value: number; // 0–1 normalized
	projectCount: number;
	boostStars: number; // 0 = no boost, 1 = ✦, 2 = ✦✦
}

export interface RankedItem {
	name: string;
	count: number;
	axes: string[];
}

export interface Boost {
	axis: string;
	extra: number;   // virtual project count added to axis score
	stars?: number;  // 1 = ✦, 2 = ✦✦ (defaults to 1)
	bullets: string[]; // bullet points shown in the UI boost card
}

/**
 * Skill boosts — artificially increase an axis score to reflect
 * current skills and active work not yet documented in projects.
 * Adjust `extra` to tune the radar shape. Each unit ≈ one project.
 */
// Sorted by stars descending, then alphabetically within each tier
export const boosts: Boost[] = [
	// ── ✦✦ Double boosts ──────────────────────────────────────────────────
	{
		axis: 'AI',
		extra: 6,
		stars: 2,
		bullets: [
			'LLM orchestration and multi-step reasoning chains',
			'Memory layers and context management systems',
			'Agentic frameworks, harnesses, and prompt iteration cycles',
			'Tool calling workflows and AI runtime state management',
			'RAG systems, vector retrieval, and knowledge pipelines',
			'Structured output handling and multi-modal integrations'
		]
	},
	{
		axis: 'Testing',
		extra: 5,
		stars: 2,
		bullets: [
			'Visual regression and snapshot testing suites',
			'Integration and end-to-end automated test workflows',
			'CI/CD pipeline gate validation and deployment testing',
			'Contract testing and deterministic output verification'
		]
	},
	// ── ✦ Single boosts ───────────────────────────────────────────────────
	{
		axis: 'Architecture',
		extra: 3,
		stars: 1,
		bullets: [
			'Distributed systems design and event-driven architectures',
			'Fanout and queuing pipelines with load balancing strategies',
			'Scalable infrastructure and infrastructure as code (IaC)',
			'CI/CD pipelines and production deployment workflows',
			'Cloud-native AI platform design and operational patterns'
		]
	},
	{
		axis: 'Backend',
		extra: 2,
		stars: 1,
		bullets: [
			'Structured backend services with organized, production-ready code patterns',
			'Telemetry, observability, and structured logging integration',
			'Typed error handling, input validation, and resilience patterns'
		]
	},
	{
		axis: 'Data',
		extra: 2,
		stars: 1,
		bullets: [
			'Data pipeline design and stream processing architectures',
			'Schema evolution, normalization, and data quality patterns'
		]
	},
	{
		axis: 'Frontend',
		extra: 2,
		stars: 1,
		bullets: [
			'Flutter and cross-platform mobile framework development',
			'Mobile-first UI patterns, responsive layouts, and native integrations'
		]
	},
	{
		axis: 'Systems',
		extra: 2,
		stars: 1,
		bullets: [
			'Low-level system design and runtime performance engineering',
			'Event-driven state machines and concurrent processing patterns'
		]
	}
];

interface AxisDefinition {
	label: string;
	description: string;
	capabilities: string[];
	tech: string[];
}

const axisDefinitions: AxisDefinition[] = [
	{
		label: 'Frontend',
		description: 'UI, UX, and client-side development',
		capabilities: [
			'Interface Design', 'State Management', 'Frontend Development',
			'UX Design', 'Kiosk UX', 'No-Code Tooling', 'Form Modeling',
			'Rule Systems', 'State-Based Navigation', 'UI Flow', 'Localization',
			'Input Handling', 'Streaming Interfaces', 'Game Development',
			'Local Multiplayer', '2D Rendering', 'Animation Loops', 'Tile Maps'
		],
		tech: [
			'React', 'Vue.js', 'SvelteKit', 'Next.js', 'HTML', 'CSS',
			'Material UI', 'JavaFX', 'Swing', 'AWT', 'Canvas Rendering',
			'react-i18next', 'QR Code', 'TypeScript', 'JavaScript',
			'Google Maps API', 'WordsAPI'
		]
	},
	{
		label: 'Backend',
		description: 'APIs, services, and server-side logic',
		capabilities: [
			'Full-Stack Development', 'API Client Design', 'API Integration',
			'Web Service Design', 'CRUD Development', 'Realtime Data',
			'Marketplace Design', 'File Uploads', 'Authentication', 'Access Control',
			'Typed Error Handling'
		],
		tech: [
			'Node.js', 'Express', '.NET', 'ASP.NET MVC', 'ASP.NET',
			'Supabase', 'MySQL', 'Entity Framework', 'TypeScript', 'JavaScript',
			'C#', 'Firebase'
		]
	},
	{
		label: 'Data',
		description: 'Modeling, pipelines, and transformation',
		capabilities: [
			'Data Modeling', 'Parsing', 'JSON Processing', 'Data Mapping',
			'Data Normalization', 'Data Engineering', 'Data Visualization',
			'Data Structures', 'ETL Pipeline Design', 'Document Processing',
			'Text Processing'
		],
		tech: ['BigQuery', 'pgvector', 'Zod', 'JSON Schema', 'GS1', 'TypeScript', 'Python']
	},
	{
		label: 'Systems',
		description: 'Low-level, protocols, and algorithm-heavy work',
		capabilities: [
			'Serialization', 'Client-Server Systems', 'Object Graph Handling',
			'Signal Processing', 'File I/O', 'Binary Parsing', 'Recursive Descent',
			'FFT', 'Event-Driven Systems', 'State Machines', 'Simulation',
			'Payment Flow Modeling', 'Recursive State Updates', 'Threaded Runtime',
			'Reflection', 'Recursive Traversal', 'Algorithms'
		],
		tech: ['C++', 'Java', 'Sockets', 'XML', 'JDOM', 'WAV/PCM', 'MIDI Audio', 'MigLayout']
	},
	{
		label: 'AI',
		description: 'LLM integration, RAG, and intelligent systems',
		capabilities: [
			'AI-Assisted Content Generation', 'AI Orchestration', 'OpenAI Integration',
			'Retrieval-Augmented Generation', 'Vector Search', 'Knowledge Retrieval',
			'Structured Output Handling'
		],
		tech: ['OpenAI', 'pgvector', 'JSON Schema']
	},
	{
		label: 'Architecture',
		description: 'System design, migrations, and platform thinking',
		capabilities: [
			'Software Architecture', 'Internal Tooling', 'Backend Architecture',
			'Cloud Architecture', 'Integration Design', 'Legacy System Analysis',
			'Legacy Modernization', 'Incremental Migration', 'Dependency Mapping',
			'Reverse Proxy Design', 'Fallback Routing', 'Rollout Strategy', 'Library Design',
			'Reverse Engineering', 'Observability', 'Backup & Recovery'
		],
		tech: ['YARP', 'Google Cloud', 'Grafana', 'OpenTelemetry']
	},
	{
		label: 'Testing',
		description: 'Coverage, quality engineering, and validation',
		capabilities: [
			'Test Coverage', 'Contract Testing', 'Regression Checking',
			'Deterministic Output Design', 'Validation', 'Edge Case Handling',
			'Performance-Oriented Delivery', 'Standards Compliance'
		],
		tech: ['Jest', 'Vitest', 'JUnit']
	}
];

// Build inverted lookup maps: item name → which axes it belongs to
const techToAxes = new Map<string, string[]>();
const capToAxes = new Map<string, string[]>();

for (const axis of axisDefinitions) {
	for (const t of axis.tech) {
		if (!techToAxes.has(t)) techToAxes.set(t, []);
		techToAxes.get(t)!.push(axis.label);
	}
	for (const c of axis.capabilities) {
		if (!capToAxes.has(c)) capToAxes.set(c, []);
		capToAxes.get(c)!.push(axis.label);
	}
}

// Build boost lookup
const boostMap = new Map(boosts.map((b) => [b.axis, b]));

// Score each axis by distinct project count
const rawScores = axisDefinitions.map((axis) => {
	const boostEntry = boostMap.get(axis.label);
	return {
		label: axis.label,
		description: axis.description,
		projectCount: projectEntries.filter((entry) => {
			const fm = entry.frontmatter;
			return (
				fm.capabilities.some((c) => axis.capabilities.includes(c)) ||
				fm.tech.some((t) => axis.tech.includes(t))
			);
		}).length,
		boostStars: boostEntry ? (boostEntry.stars ?? 1) : 0
	};
});

const boostedValues = rawScores.map((s) => {
	const boost = boostMap.get(s.label);
	const extra = boost?.extra ?? 0;
	const multiplier = (boost?.stars ?? 1) >= 2 ? 2 : 1;
	return s.projectCount + extra * multiplier;
});
const maxScore = Math.max(...boostedValues);

export const radarData: RadarAxis[] = rawScores.map((s, i) => ({
	...s,
	value: boostedValues[i] / maxScore
}));

function countFromEntries(
	accessor: (fm: ProjectFrontmatter) => string[],
	axesMap: Map<string, string[]>
): RankedItem[] {
	const counts = new Map<string, number>();
	for (const entry of projectEntries) {
		for (const value of accessor(entry.frontmatter)) {
			counts.set(value, (counts.get(value) ?? 0) + 1);
		}
	}
	return [...counts.entries()]
		.map(([name, count]) => ({ name, count, axes: axesMap.get(name) ?? [] }))
		.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export const techRanking: RankedItem[] = countFromEntries((fm) => fm.tech, techToAxes);
export const capabilityRanking: RankedItem[] = countFromEntries((fm) => fm.capabilities, capToAxes);

export const totalProjects = projectEntries.length;
export const totalTech = techRanking.length;
export const totalCapabilities = capabilityRanking.length;

const startYears = projectEntries.map((e) => new Date(e.frontmatter.startDate).getFullYear());
export const yearRange = { min: Math.min(...startYears), max: Math.max(...startYears) };

export const originBreakdown: RankedItem[] = countFromEntries((fm) => [fm.origin], new Map());

export interface ProjectListItem {
	title: string;
	slug: string;
	axes: string[];
}

export const projectList: ProjectListItem[] = projectEntries
	.map((entry) => {
		const fm = entry.frontmatter;
		const matchedAxes = axisDefinitions
			.filter(
				(axis) =>
					fm.capabilities.some((c) => axis.capabilities.includes(c)) ||
					fm.tech.some((t) => axis.tech.includes(t))
			)
			.map((axis) => axis.label);
		return { title: fm.title, slug: fm.slug, axes: matchedAxes };
	})
	.sort((a, b) => a.title.localeCompare(b.title));
