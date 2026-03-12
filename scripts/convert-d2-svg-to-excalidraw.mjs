import { DOMParser } from '@xmldom/xmldom';
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const DIAGRAMS_ROOT = path.join(ROOT, 'src', 'content', 'projects');
const SVG_EXTENSION = '.svg';
const EXCALIDRAW_EXTENSION = '.excalidraw';
const TIMESTAMP = Date.now();
const THEME = {
	canvasBackground: '#ffffff',
	gridSize: 20,
	defaultStrokeColor: '#1e1e1e',
	defaultFillColor: '#e9ecef',
	defaultTextColor: '#1e1e1e',
	defaultNodeFontSize: 20,
	defaultEdgeFontSize: 16,
	defaultStrokeWidth: 2,
	defaultRoughness: 1,
	defaultOpacity: 100,
	textPadding: 8,
	fontFamily: 5,
	edgeColor: '#868e96',
	shapeFillStyle: 'hachure',
	textFillStyle: 'solid',
	nodePalettes: {
		blue: {
			stroke: '#1971c2',
			fill: '#e7f5ff'
		},
		green: {
			stroke: '#2f9e44',
			fill: '#ebfbee'
		},
		orange: {
			stroke: '#f08c00',
			fill: '#fff9db'
		},
		white: {
			stroke: '#1e1e1e',
			fill: '#e9ecef'
		},
		purple: {
			stroke: '#6741d9',
			fill: '#f3f0ff'
		},
		red: {
			stroke: '#e03131',
			fill: '#fff5f5'
		}
	}
};

const NODE_COLOR_FAMILIES = {
	blue: new Set(['#0369A1', '#0D32B2', '#1D4ED8', '#2F6FED', '#BFDBFE', '#DBEAFE', '#DFF1F7', '#E8F1FF']),
	green: new Set(['#0F766E', '#15803D', '#2C8A5A', '#5C8E58', '#CCFBF1', '#DCFCE7', '#E8F4E7', '#EEF8F3']),
	orange: new Set(['#B98A2E', '#C2410C', '#D97706', '#F8ECD7', '#FFF5E8', '#FFFBEB']),
	white: new Set(['#64748B', '#6B7B93', '#8A97A8', '#EEF3F8', '#F5F8FC', '#F7FAFC', '#F8FAFC']),
	purple: new Set(['#7C3AED', '#EDF0FD', '#F3E8FF']),
	red: new Set(['#BE5A5A', '#FDE7E7'])
};

function walk(directory, extension) {
	const entries = readdirSync(directory, { withFileTypes: true });
	const files = [];

	for (const entry of entries) {
		const fullPath = path.join(directory, entry.name);
		if (entry.isDirectory()) {
			files.push(...walk(fullPath, extension));
			continue;
		}

		if (entry.isFile() && entry.name.endsWith(extension)) {
			files.push(fullPath);
		}
	}

	return files;
}

function parseStyle(styleValue = '') {
	return styleValue
		.split(';')
		.map((part) => part.trim())
		.filter(Boolean)
		.reduce((styles, part) => {
			const separator = part.indexOf(':');
			if (separator === -1) return styles;
			const key = part.slice(0, separator).trim();
			const value = part.slice(separator + 1).trim();
			styles[key] = value;
			return styles;
		}, {});
}

function asArray(nodeList) {
	return Array.from({ length: nodeList.length }, (_, index) => nodeList.item(index));
}

function getInnerSvg(document) {
	const svgNodes = asArray(document.getElementsByTagName('svg'));
	return svgNodes.at(-1);
}

function getTopLevelGroups(svgNode) {
	return asArray(svgNode.childNodes).filter(
		(node) => node.nodeType === 1 && node.tagName === 'g' && node.getAttribute('class')
	);
}

function extractTextContent(textNode) {
	const tspans = asArray(textNode.getElementsByTagName('tspan'));
	if (tspans.length > 0) {
		return tspans.map((node) => node.textContent.trim()).filter(Boolean).join('\n');
	}

	return textNode.textContent.trim();
}

function parsePathEndpoints(pathData) {
	const numbers = (pathData.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number);
	if (numbers.length < 4) {
		return null;
	}

	return {
		startX: numbers[0],
		startY: numbers[1],
		endX: numbers[numbers.length - 2],
		endY: numbers[numbers.length - 1]
	};
}

function estimateTextBox(text, fontSize) {
	const lines = text.split('\n');
	const widestLine = Math.max(...lines.map((line) => line.length), 1);
	return {
		width: Math.max(40, widestLine * fontSize * 0.62),
		height: Math.max(fontSize * 1.4, lines.length * fontSize * 1.25)
	};
}

function normalizeColorToken(color) {
	return color ? color.trim().toUpperCase() : '';
}

function resolveNodePalette(strokeColor, backgroundColor) {
	const strokeToken = normalizeColorToken(strokeColor);
	const fillToken = normalizeColorToken(backgroundColor);

	for (const [family, colors] of Object.entries(NODE_COLOR_FAMILIES)) {
		if (colors.has(strokeToken) || colors.has(fillToken)) {
			return THEME.nodePalettes[family];
		}
	}

	return THEME.nodePalettes.white;
}

function buildElbowPoints(deltaX, deltaY) {
	if (Math.abs(deltaX) < 1 || Math.abs(deltaY) < 1) {
		return [
			[0, 0],
			[deltaX, deltaY]
		];
	}

	if (Math.abs(deltaX) >= Math.abs(deltaY)) {
		const midX = deltaX / 2;
		return [
			[0, 0],
			[midX, 0],
			[midX, deltaY],
			[deltaX, deltaY]
		];
	}

	const midY = deltaY / 2;
	return [
		[0, 0],
		[0, midY],
		[deltaX, midY],
		[deltaX, deltaY]
	];
}

function normalizeArrowElement(arrow) {
	const originalPoints = Array.isArray(arrow.points) ? arrow.points : [];
	const endPoint = originalPoints.at(-1) ?? [arrow.width ?? 0, arrow.height ?? 0];
	const deltaX = endPoint[0] ?? 0;
	const deltaY = endPoint[1] ?? 0;

	return {
		...arrow,
		strokeColor: THEME.edgeColor,
		points: buildElbowPoints(deltaX, deltaY),
		startArrowhead: arrow.startArrowhead ? 'arrow' : null,
		endArrowhead: 'arrow',
		roundness: null,
		elbowed: true
	};
}

function normalizeDiagram(diagram) {
	const elementsById = new Map(diagram.elements.map((element) => [element.id, element]));

	return {
		...diagram,
		appState: {
			...(diagram.appState ?? {}),
			viewBackgroundColor: THEME.canvasBackground,
			gridSize: THEME.gridSize
		},
		elements: diagram.elements.map((element) => {
			if (element.type === 'arrow') {
				return {
					...normalizeArrowElement(element),
					strokeWidth: THEME.defaultStrokeWidth,
					fillStyle: THEME.shapeFillStyle
				};
			}

			if (element.type === 'rectangle') {
				return {
					...element,
					fillStyle: THEME.shapeFillStyle,
					strokeWidth: THEME.defaultStrokeWidth
				};
			}

			if (element.type === 'text' && typeof element.containerId === 'string' && element.containerId.startsWith('arrow-')) {
				return {
					...element,
					strokeColor: THEME.edgeColor,
					fillStyle: THEME.textFillStyle
				};
			}

			if (element.type === 'text') {
				const container = element.containerId ? elementsById.get(element.containerId) : null;
				return {
					...element,
					strokeColor: container?.type === 'rectangle' ? container.strokeColor : element.strokeColor,
					fillStyle: THEME.textFillStyle
				};
			}

			return element;
		})
	};
}

function createBaseElement({
	id,
	type,
	x,
	y,
	width,
	height,
	strokeColor,
	backgroundColor,
	strokeStyle,
	index,
	seed,
	boundElements = null
}) {
	return {
		id,
		type,
		x,
		y,
		width,
		height,
		angle: 0,
		strokeColor,
		backgroundColor,
		fillStyle: type === 'text' ? THEME.textFillStyle : THEME.shapeFillStyle,
		strokeWidth: THEME.defaultStrokeWidth,
		strokeStyle,
		roughness: THEME.defaultRoughness,
		opacity: THEME.defaultOpacity,
		groupIds: [],
		frameId: null,
		index,
		roundness: type === 'text' || type === 'arrow' ? null : { type: 3 },
		seed,
		version: 1,
		versionNonce: seed + 1,
		isDeleted: false,
		boundElements,
		updated: TIMESTAMP,
		link: null,
		locked: false
	};
}

function createRectangleElement({
	id,
	x,
	y,
	width,
	height,
	strokeColor,
	backgroundColor,
	text,
	fontSize,
	index,
	seed
}) {
	return {
		...createBaseElement({
			id,
			type: 'rectangle',
			x,
			y,
			width,
			height,
			strokeColor,
			backgroundColor,
			strokeStyle: 'solid',
			index,
			seed,
			boundElements: text ? [{ id: `${id}-text`, type: 'text' }] : null
		})
	};
}

function createTextElement({
	id,
	x,
	y,
	text,
	fill,
	fontSize,
	textAlign,
	index,
	seed,
	containerId = null,
	width,
	height,
	verticalAlign = 'top',
	autoResize = true
}) {
	const bounds = estimateTextBox(text, fontSize);
	const textWidth = width ?? bounds.width;
	const textHeight = height ?? bounds.height;
	let originX = x;

	if (textAlign === 'center') {
		originX -= textWidth / 2;
	} else if (textAlign === 'right') {
		originX -= textWidth;
	}

	return {
		...createBaseElement({
			id,
			type: 'text',
			x: originX,
			y,
			width: textWidth,
			height: textHeight,
			strokeColor: fill,
			backgroundColor: 'transparent',
			strokeStyle: 'solid',
			index,
			seed
		}),
		text,
		originalText: text,
		fontSize,
		fontFamily: THEME.fontFamily,
		textAlign,
		verticalAlign,
		containerId,
		autoResize,
		lineHeight: 1.25
	};
}

function createArrowElement({
	id,
	startX,
	startY,
	endX,
	endY,
	strokeColor,
	strokeStyle,
	hasStartArrowhead,
	hasLabel,
	index,
	seed
}) {
	return {
		...createBaseElement({
			id,
			type: 'arrow',
			x: startX,
			y: startY,
			width: endX - startX,
			height: endY - startY,
			strokeColor,
			backgroundColor: 'transparent',
			strokeStyle,
			index,
			seed,
			boundElements: hasLabel ? [{ id: `${id}-text`, type: 'text' }] : null
		}),
		points: buildElbowPoints(endX - startX, endY - startY),
		startBinding: null,
		endBinding: null,
		startArrowhead: hasStartArrowhead ? 'arrow' : null,
		endArrowhead: 'arrow',
		elbowed: true
	};
}

function convertSvg(svgPath) {
	const raw = readFileSync(svgPath, 'utf8');
	const document = new DOMParser().parseFromString(raw, 'image/svg+xml');
	const svgNode = getInnerSvg(document);
	const groups = getTopLevelGroups(svgNode);

	let indexCounter = 0;
	let seedCounter = 1000;
	const elements = [];

	for (const group of groups) {
		const rect = group.getElementsByTagName('rect').item(0);
		const pathNode = group.getElementsByTagName('path').item(0);
		const textNodes = asArray(group.getElementsByTagName('text'));

		if (rect && !pathNode) {
			const x = Number(rect.getAttribute('x'));
			const y = Number(rect.getAttribute('y'));
			const width = Number(rect.getAttribute('width'));
			const height = Number(rect.getAttribute('height'));
			const sourceStrokeColor = rect.getAttribute('stroke') ?? THEME.defaultStrokeColor;
			const sourceBackgroundColor = rect.getAttribute('fill') ?? THEME.defaultFillColor;
			const palette = resolveNodePalette(sourceStrokeColor, sourceBackgroundColor);
			const textNode = textNodes[0];
			const text = textNode ? extractTextContent(textNode) : '';
			const fontStyles = parseStyle(textNode?.getAttribute('style') ?? '');
			const fontSize =
				Number.parseFloat((fontStyles['font-size'] ?? `${THEME.defaultNodeFontSize}`).replace('px', '')) ||
				THEME.defaultNodeFontSize;

			const rectangleId = `rect-${indexCounter}`;
			const textId = `${rectangleId}-text`;
			elements.push(
				createRectangleElement({
					id: rectangleId,
					x,
					y,
					width,
					height,
					strokeColor: palette.stroke,
					backgroundColor: palette.fill,
					text,
					fontSize,
					index: `a${indexCounter}`,
					seed: seedCounter
				})
			);
			indexCounter += 1;
			seedCounter += 17;

			if (text) {
				elements.push(
					createTextElement({
						id: textId,
						x: x + width / 2,
						y: y + Math.max(THEME.textPadding, (height - estimateTextBox(text, fontSize).height) / 2),
						text,
						fill: palette.stroke,
						fontSize,
						textAlign: 'center',
						index: `a${indexCounter}`,
						seed: seedCounter,
						containerId: rectangleId,
						width: Math.max(24, width - THEME.textPadding * 2),
						height: Math.max(fontSize * 1.25, height - THEME.textPadding * 2),
						verticalAlign: 'middle',
						autoResize: false
					})
				);
				indexCounter += 1;
				seedCounter += 17;
			}
			continue;
		}

		if (pathNode) {
			const endpoints = parsePathEndpoints(pathNode.getAttribute('d') ?? '');
			if (!endpoints) {
				continue;
			}

			const pathStyles = parseStyle(pathNode.getAttribute('style'));
			const strokeStyle = pathStyles['stroke-dasharray'] ? 'dashed' : 'solid';
			const hasStartArrowhead = Boolean(pathNode.getAttribute('marker-start'));
			const connectorLabels = textNodes
				.map((textNode) => {
					const text = extractTextContent(textNode);
					if (!text) return null;

					const fontStyles = parseStyle(textNode.getAttribute('style') ?? '');
					const fontSize =
						Number.parseFloat(
							(fontStyles['font-size'] ?? `${THEME.defaultEdgeFontSize}`).replace('px', '')
						) || THEME.defaultEdgeFontSize;

					return {
						textNode,
						text,
						fontSize,
						textAlign: fontStyles['text-anchor'] === 'middle' ? 'center' : 'left'
					};
				})
				.filter(Boolean);
			const arrowId = `arrow-${indexCounter}`;

			elements.push(
				createArrowElement({
					id: arrowId,
					startX: endpoints.startX,
					startY: endpoints.startY,
					endX: endpoints.endX,
					endY: endpoints.endY,
					strokeColor: THEME.edgeColor,
					strokeStyle,
					hasStartArrowhead,
					hasLabel: connectorLabels.length > 0,
					index: `a${indexCounter}`,
					seed: seedCounter
				})
			);
			indexCounter += 1;
			seedCounter += 17;

			for (const [labelIndex, label] of connectorLabels.entries()) {
				const labelId = labelIndex === 0 ? `${arrowId}-text` : `label-${indexCounter}`;
				const estimatedBounds = estimateTextBox(label.text, label.fontSize);
				elements.push(
					createTextElement({
						id: labelId,
						x: Number(label.textNode.getAttribute('x')),
						y: Number(label.textNode.getAttribute('y')) - label.fontSize,
						text: label.text,
						fill: THEME.edgeColor,
						fontSize: label.fontSize,
						textAlign: label.textAlign,
						index: `a${indexCounter}`,
						seed: seedCounter,
						containerId: arrowId,
						width: estimatedBounds.width,
						height: estimatedBounds.height,
						verticalAlign: 'middle',
						autoResize: true
					})
				);
				indexCounter += 1;
				seedCounter += 17;
			}
		}
	}

	return {
		type: 'excalidraw',
		version: 2,
		source: 'https://excalidraw.com',
		elements,
		appState: {
			viewBackgroundColor: THEME.canvasBackground,
			gridSize: THEME.gridSize
		},
		files: {}
	};
}

function main() {
	const svgFiles = walk(DIAGRAMS_ROOT, SVG_EXTENSION);

	let converted = 0;
	for (const svgPath of svgFiles) {
		const diagram = normalizeDiagram(convertSvg(svgPath));
		const outputPath = svgPath.replace(/\.svg$/i, EXCALIDRAW_EXTENSION);
		mkdirSync(path.dirname(outputPath), { recursive: true });
		writeFileSync(outputPath, `${JSON.stringify(diagram, null, 2)}\n`, 'utf8');
		converted += 1;
	}

	for (const excalidrawPath of walk(DIAGRAMS_ROOT, EXCALIDRAW_EXTENSION)) {
		const diagram = JSON.parse(readFileSync(excalidrawPath, 'utf8'));
		const normalized = normalizeDiagram(diagram);
		writeFileSync(excalidrawPath, `${JSON.stringify(normalized, null, 2)}\n`, 'utf8');
	}

	console.log(`Converted ${converted} SVG diagrams to Excalidraw.`);
}

main();
