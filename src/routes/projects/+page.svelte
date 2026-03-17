<script lang="ts">
	import { projects } from '$lib/data/projects';
	import { sortTags } from '$lib/data/tags';
	import Hero from '$lib/components/Hero.svelte';
	import FilterBar from '$lib/components/FilterBar.svelte';
	import BentoGrid from '$lib/components/BentoGrid.svelte';

	let selectedTags = $state(new Set<string>());
	let availableTags = $derived(sortTags(projects.flatMap((project) => project.tags)));

	let filteredProjects = $derived(
		selectedTags.size === 0
			? projects
			: projects.filter((p) => [...selectedTags].every((tag) => p.tags.includes(tag)))
	);

	let dormantTags = $derived(
		availableTags.filter((t) => {
			if (selectedTags.has(t)) return false;
			return filteredProjects.some((p) => p.tags.includes(t));
		})
	);

	function handleTagToggle(tag: string) {
		const next = new Set(selectedTags);
		if (next.has(tag)) {
			next.delete(tag);
		} else {
			next.add(tag);
		}
		selectedTags = next;
	}
</script>

<svelte:head>
	<title>Derek Urban — Projects</title>
</svelte:head>

<Hero />
<FilterBar tags={availableTags} {selectedTags} {dormantTags} onTagToggle={handleTagToggle} />
<BentoGrid {filteredProjects} />
