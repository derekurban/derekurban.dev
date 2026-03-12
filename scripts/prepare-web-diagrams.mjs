import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, '..');
const contentRoot = path.join(projectRoot, 'src', 'content', 'projects');

async function walk(dir) {
	const entries = await readdir(dir, { withFileTypes: true });
	const files = await Promise.all(
		entries.map((entry) => {
			const fullPath = path.join(dir, entry.name);
			return entry.isDirectory() ? walk(fullPath) : fullPath;
		})
	);

	return files.flat();
}

function formatKiB(bytes) {
	return `${(bytes / 1024).toFixed(1)} KiB`;
}

function transcodePng(sourcePath, targetPath) {
	const result = spawnSync(
		'ffmpeg',
		[
			'-y',
			'-loglevel',
			'error',
			'-i',
			sourcePath,
			'-map_metadata',
			'-1',
			'-frames:v',
			'1',
			'-compression_level',
			'9',
			'-pred',
			'mixed',
			targetPath
		],
		{
			cwd: projectRoot,
			stdio: 'pipe',
			encoding: 'utf8'
		}
	);

	if (result.status !== 0) {
		throw new Error(result.stderr || `ffmpeg failed for ${sourcePath}`);
	}
}

async function main() {
	const allFiles = await walk(contentRoot);
	const diagramSources = allFiles.filter((file) => file.endsWith('.excalidraw.png')).sort();
	const postFiles = allFiles.filter((file) => path.basename(file) === 'POST.md').sort();

	if (diagramSources.length === 0) {
		console.log('No .excalidraw.png files found.');
		return;
	}

	let totalBefore = 0;
	let totalAfter = 0;

	for (const sourcePath of diagramSources) {
		const targetPath = sourcePath.replace(/\.excalidraw\.png$/, '.png');
		transcodePng(sourcePath, targetPath);

		const [beforeStats, afterStats] = await Promise.all([stat(sourcePath), stat(targetPath)]);
		totalBefore += beforeStats.size;
		totalAfter += afterStats.size;

		console.log(
			`${path.relative(projectRoot, sourcePath)} -> ${path.relative(projectRoot, targetPath)} (${formatKiB(beforeStats.size)} -> ${formatKiB(afterStats.size)})`
		);
	}

	let updatedPosts = 0;

	for (const postPath of postFiles) {
		const original = await readFile(postPath, 'utf8');
		const updated = original.replaceAll('.excalidraw.png', '.png');

		if (updated !== original) {
			await writeFile(postPath, updated);
			updatedPosts += 1;
			console.log(`Updated ${path.relative(projectRoot, postPath)}`);
		}
	}

	console.log(
		`Created ${diagramSources.length} web PNGs and updated ${updatedPosts} posts (${formatKiB(totalBefore)} -> ${formatKiB(totalAfter)}).`
	);
}

main().catch((error) => {
	console.error(error instanceof Error ? error.message : error);
	process.exit(1);
});
