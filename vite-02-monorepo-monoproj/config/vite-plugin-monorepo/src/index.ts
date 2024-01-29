import * as esbuild from 'esbuild';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as vite from 'vite';

// RegExp for stripping comments from JSON, taken from https://github.com/tarkh/json-easy-strip
const commentsRegexp = /\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g;

interface TsConfig {
	compilerOptions?: {
		rootDir?: string;
	};
	references?: Array<{ path: string }>;
}

interface Package {
	name: string;
}

interface RefPackage {
	rootDir: string;
	resolveDir: string;
}

const parseJSONFile = <T>(filePath: string, stripComments: boolean = false): T | null => {
	try {
		let content = fs.readFileSync(filePath, 'utf8');
		if (stripComments) {
			content = content.replace(commentsRegexp, (m, g) => (g ? '' : m));
		}
		return JSON.parse(content) as T;
	} catch (error) {
		console.error(`Error parsing JSON file: ${filePath}`, error);
		return null;
	}
};

const replacePrefix = (input: string, searchValue: string, replaceValue: string): string => {
	return input.startsWith(searchValue) ? replaceValue + input.slice(searchValue.length) : input;
};

const resolveRefPackages = (
	baseDir: string,
	tsconfig: TsConfig,
	processedDirs: string[],
): Record<string, RefPackage> => {
	if (processedDirs.includes(baseDir)) {
		return {};
	}

	processedDirs.push(baseDir);

	return (tsconfig.references || []).reduce<Record<string, RefPackage>>((acc, r) => {
		const refPath = path.resolve(baseDir, r.path);
		const refPackage: Package = parseJSONFile(path.join(refPath, 'package.json'));
		const refTsconfig: TsConfig = parseJSONFile(path.join(refPath, 'tsconfig.json'), true);

		if (!refTsconfig.compilerOptions?.rootDir) {
			throw new Error(
				`rootDir is not defined in tsconfig.json of package '${refPackage.name}'`,
			);
		}

		acc[refPackage.name] = {
			rootDir: refTsconfig.compilerOptions.rootDir,
			resolveDir: path.resolve(refPath, refTsconfig.compilerOptions.rootDir),
		};

		Object.assign(acc, resolveRefPackages(refPath, refTsconfig, processedDirs));

		return acc;
	}, {});
};

const resolveEntrypoint = (entrypoint: string): Record<string, RefPackage> => {
	const rootDir = path.parse(entrypoint).root;
	let baseDir = path.dirname(entrypoint);
	let tsconfigPath: string;

	while (baseDir !== rootDir) {
		tsconfigPath = path.join(baseDir, 'tsconfig.json');
		if (fs.existsSync(tsconfigPath)) {
			break;
		}

		baseDir = path.resolve(baseDir, '..');
	}

	if (baseDir === rootDir) {
		throw new Error('tsconfig.json not found');
	}

	const tsconfig: TsConfig = parseJSONFile(tsconfigPath, true);
	const processedDirs: string[] = [];
	return resolveRefPackages(baseDir, tsconfig, processedDirs);
};

const tsReferences: esbuild.Plugin = {
	name: 'typescript-references',
	setup(build) {
		const entryPointOptions = build.initialOptions.entryPoints;
		const entryPoints: string[] = Array.isArray(entryPointOptions)
			? entryPointOptions.map(entrypoint =>
					typeof entrypoint === 'string' ? entrypoint : entrypoint.in,
			  )
			: Object.values(entryPointOptions);
		const refPackages = entryPoints.reduce<Record<string, RefPackage>>((acc, entrypoint) => {
			return Object.assign(acc, resolveEntrypoint(entrypoint));
		}, {});

		if (Object.keys(refPackages).length === 0) {
			return;
		}

		const filter = new RegExp(`^(${Object.keys(refPackages).join('|')})`);
		build.onResolve({ filter }, async args => {
			let packageName = args.path;
			let file = './index.ts';

			if (!refPackages[packageName]) {
				for (const name of Object.keys(refPackages)) {
					if (packageName.startsWith(name)) {
						file = './' + packageName.slice(name.length + 1);
						packageName = name;
						break;
					}
				}
			}

			file = replacePrefix(file, refPackages[packageName].rootDir, './');

			const result = await build.resolve(file, {
				resolveDir: refPackages[packageName].resolveDir,
				kind: 'entry-point',
			});

			if (result.errors.length > 0) {
				return { errors: result.errors };
			}

			return { path: result.path };
		});
	},
};

const viteMonorepo: vite.Plugin = {
	name: 'typescript-references',
	config: () => ({
		//esbuild: {},
		optimizeDeps: {
			esbuildOptions: {
				plugins: [tsReferences],
			},
		},
	}),
};

export = viteMonorepo;
