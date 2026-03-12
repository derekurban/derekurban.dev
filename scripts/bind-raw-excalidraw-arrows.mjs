import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const PROJECTS_ROOT = path.join(ROOT, 'src', 'content', 'projects');
const EXCALIDRAW_EXTENSION = '.excalidraw';
const PNG_SUFFIX = '.excalidraw.png';
const MAX_BIND_GAP = 8;
const MIN_ARROW_SPAN = 1;

function walk(directory, files = []) {
	const entries = readdirSync(directory, { withFileTypes: true });

	for (const entry of entries) {
		const fullPath = path.join(directory, entry.name);
		if (entry.isDirectory()) {
			walk(fullPath, files);
			continue;
		}

		if (entry.isFile() && entry.name.endsWith(EXCALIDRAW_EXTENSION)) {
			files.push(fullPath);
		}
	}

	return files;
}

function round(value) {
	return Number(value.toFixed(6));
}

function clamp(value, min, max) {
	return Math.min(Math.max(value, min), max);
}

function getRawExcalidrawFiles() {
	return walk(PROJECTS_ROOT).filter((filePath) => !existsSync(`${filePath}.png`));
}

function getArrowEndpoints(arrow) {
	const startPoint = arrow.points?.[0] ?? [0, 0];
	const endPoint = arrow.points?.at(-1) ?? [arrow.width ?? 0, arrow.height ?? 0];

	const start = {
		x: arrow.x + startPoint[0],
		y: arrow.y + startPoint[1]
	};
	const end = {
		x: arrow.x + endPoint[0],
		y: arrow.y + endPoint[1]
	};

	return {
		start,
		end,
		span: Math.hypot(end.x - start.x, end.y - start.y)
	};
}

function getRectBinding(rectangle, point) {
	const left = rectangle.x;
	const right = rectangle.x + rectangle.width;
	const top = rectangle.y;
	const bottom = rectangle.y + rectangle.height;
	const centerX = rectangle.x + rectangle.width / 2;
	const centerY = rectangle.y + rectangle.height / 2;

	const candidates = [
		{
			gap: Math.hypot(point.x - left, point.y - clamp(point.y, top, bottom)),
			focus: (point.y - centerY) / Math.max(rectangle.height / 2, 1)
		},
		{
			gap: Math.hypot(point.x - right, point.y - clamp(point.y, top, bottom)),
			focus: (point.y - centerY) / Math.max(rectangle.height / 2, 1)
		},
		{
			gap: Math.hypot(point.x - clamp(point.x, left, right), point.y - top),
			focus: (point.x - centerX) / Math.max(rectangle.width / 2, 1)
		},
		{
			gap: Math.hypot(point.x - clamp(point.x, left, right), point.y - bottom),
			focus: (point.x - centerX) / Math.max(rectangle.width / 2, 1)
		}
	];

	candidates.sort((a, b) => a.gap - b.gap);
	return {
		elementId: rectangle.id,
		gap: round(candidates[0].gap),
		focus: round(clamp(candidates[0].focus, -1, 1))
	};
}

function findNearestBinding(rectangles, point) {
	const candidates = rectangles.map((rectangle) => getRectBinding(rectangle, point));
	candidates.sort((a, b) => a.gap - b.gap);
	return candidates[0]?.gap <= MAX_BIND_GAP ? candidates[0] : null;
}

function bindDiagram(diagram) {
	const rectangles = diagram.elements.filter((element) => element.type === 'rectangle');
	const arrowRefsByRectangle = new Map(
		rectangles.map((rectangle) => [
			rectangle.id,
			new Map((rectangle.boundElements ?? []).map((bound) => [bound.id, bound]))
		])
	);

	let arrowsUpdated = 0;
	let endpointsBound = 0;

	const elements = diagram.elements.map((element) => {
		if (element.type !== 'arrow') {
			return element;
		}

		const { start, end, span } = getArrowEndpoints(element);
		if (span < MIN_ARROW_SPAN) {
			return {
				...element,
				startBinding: null,
				endBinding: null
			};
		}

		const startBinding = findNearestBinding(rectangles, start);
		const endBinding = findNearestBinding(rectangles, end);

		if (startBinding) {
			arrowRefsByRectangle.get(startBinding.elementId)?.set(element.id, {
				id: element.id,
				type: 'arrow'
			});
			endpointsBound += 1;
		}

		if (endBinding) {
			arrowRefsByRectangle.get(endBinding.elementId)?.set(element.id, {
				id: element.id,
				type: 'arrow'
			});
			endpointsBound += 1;
		}

		if (startBinding || endBinding || element.startBinding || element.endBinding) {
			arrowsUpdated += 1;
		}

		return {
			...element,
			startBinding,
			endBinding
		};
	});

	return {
		diagram: {
			...diagram,
			elements: elements.map((element) => {
				if (element.type !== 'rectangle') {
					return element;
				}

				const boundElements = Array.from(arrowRefsByRectangle.get(element.id)?.values() ?? []);
				return {
					...element,
					boundElements: boundElements.length > 0 ? boundElements : null
				};
			})
		},
		arrowsUpdated,
		endpointsBound
	};
}

function main() {
	const files = getRawExcalidrawFiles();
	let updatedFiles = 0;
	let updatedArrows = 0;
	let boundEndpoints = 0;

	for (const filePath of files) {
		const diagram = JSON.parse(readFileSync(filePath, 'utf8'));
		const { diagram: boundDiagram, arrowsUpdated, endpointsBound } = bindDiagram(diagram);

		if (arrowsUpdated === 0) {
			continue;
		}

		writeFileSync(filePath, `${JSON.stringify(boundDiagram, null, 2)}\n`, 'utf8');
		updatedFiles += 1;
		updatedArrows += arrowsUpdated;
		boundEndpoints += endpointsBound;
	}

	console.log(
		`Updated ${updatedFiles} raw diagrams, touching ${updatedArrows} arrows and binding ${boundEndpoints} endpoints.`
	);
}

main();
