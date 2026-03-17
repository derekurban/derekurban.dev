export const tagMeta: Record<string, { label: string }> = {
	university: { label: 'University' },
	personal: { label: 'Personal' },
	professional: { label: 'Professional' },
	application: { label: 'Application' },
	'developer-tool': { label: 'Developer Tool' },
	game: { label: 'Game' },
	simulation: { label: 'Simulation' },
	platform: { label: 'Platform' },
	service: { label: 'Service' },
	migration: { label: 'Migration' },
	systems: { label: 'Systems' },
	ai: { label: 'AI' }
};

const preferredTagOrder = [
	'university',
	'personal',
	'professional',
	'application',
	'developer-tool',
	'game',
	'simulation',
	'platform',
	'service',
	'migration',
	'systems',
	'ai'
];

function formatTagLabel(tag: string): string {
	return tag
		.split(/[-_\s]+/)
		.map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
		.join(' ');
}

export function getTagLabel(tag: string): string {
	return tagMeta[tag]?.label ?? formatTagLabel(tag);
}

export function sortTags(tags: string[]): string[] {
	return [...new Set(tags)].sort((a, b) => {
		const aIndex = preferredTagOrder.indexOf(a);
		const bIndex = preferredTagOrder.indexOf(b);

		if (aIndex !== -1 && bIndex !== -1) {
			return aIndex - bIndex;
		}

		if (aIndex !== -1) {
			return -1;
		}

		if (bIndex !== -1) {
			return 1;
		}

		return getTagLabel(a).localeCompare(getTagLabel(b));
	});
}
