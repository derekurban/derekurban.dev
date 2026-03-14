import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);
const vitePackageJson = require.resolve('vite/package.json');
const viteBin = path.join(path.dirname(vitePackageJson), 'bin', 'vite.js');

function normalizePort(value) {
	if (value == null || value === '') {
		return null;
	}

	if (value === true || value === 'true') {
		return null;
	}

	const port = Number.parseInt(String(value), 10);
	return Number.isInteger(port) && port > 0 && port <= 65535 ? String(port) : null;
}

function hasCliPort(args) {
	for (let index = 0; index < args.length; index += 1) {
		const arg = args[index];
		if (arg === '--port') {
			return true;
		}
		if (arg.startsWith('--port=')) {
			return true;
		}
	}

	return false;
}

function extractPositionalPort(args) {
	for (let index = 0; index < args.length; index += 1) {
		const arg = args[index];
		if (arg.startsWith('-')) {
			continue;
		}

		const port = normalizePort(arg);
		if (port) {
			return {
				port,
				args: args.toSpliced(index, 1)
			};
		}
	}

	return {
		port: null,
		args
	};
}

const cliArgs = process.argv.slice(2);
const rawNpmPort = process.env.npm_config_port;
const npmPort = normalizePort(rawNpmPort);
const positionalPort = !hasCliPort(cliArgs) ? extractPositionalPort(cliArgs) : { port: null, args: cliArgs };
const forwardedArgs = positionalPort.args;

if (rawNpmPort && rawNpmPort !== 'true' && !npmPort) {
	console.error(`Invalid port value "${rawNpmPort}". Expected an integer between 1 and 65535.`);
	process.exit(1);
}

const viteArgs = ['dev', ...forwardedArgs];

if (!hasCliPort(forwardedArgs)) {
	const port = positionalPort.port ?? npmPort;
	if (port) {
		viteArgs.push('--port', port);
	}
}

const child = spawn(process.execPath, [viteBin, ...viteArgs], {
	stdio: 'inherit',
	env: process.env
});

child.on('exit', (code, signal) => {
	if (signal) {
		process.kill(process.pid, signal);
		return;
	}

	process.exit(code ?? 0);
});

child.on('error', (error) => {
	console.error(error);
	process.exit(1);
});
