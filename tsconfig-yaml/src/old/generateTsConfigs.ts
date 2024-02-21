import * as fs from 'node:fs';
import * as path from 'node:path';
import { parseDocument } from 'yaml';
import chokidar from 'chokidar';
import { consoleLogger } from '@/utils/logger';
import type { TsConfigYaml, ProjectConfig, AspectConfig, BaseOptions } from './types';

// Main function to handle reading and generating tsconfig files.
function generateTsConfigs(dir: string) {
	dir = toAbsolute(dir);
	consoleLogger.info('Generating tsconfig files...');
	consoleLogger.info('Directory:', dir);

	const yamlFilePath = findTsConfigYaml(dir);

	if (!yamlFilePath) {
		console.error('No tsconfig.yaml or tsconfig.yml file found.');
		process.exit(1);
	}

	consoleLogger.info('Found tsconfig.yaml file:', yamlFilePath);

	try {
		const yamlContent = fs.readFileSync(yamlFilePath, 'utf8');
		const config = parseDocument(yamlContent).toJSON() as TsConfigYaml;

		consoleLogger.debug('Parsed YAML content:', config);

		// Generate tsconfigs for each project.
		for (const [projectName, project] of Object.entries(config.projects)) {
			consoleLogger.info('Generating tsconfig files for project:', projectName);
			generateProjectTsConfig(dir, projectName, project, config);

			// Generate tsconfigs for each aspect if any.
			if (project.aspects) {
				for (const aspect of project.aspects) {
					consoleLogger.debug('Generating tsconfig for aspect:', aspect);
					generateaspectTsConfig(dir, projectName, aspect, config);
				}
			}
		}

		consoleLogger.info('Generated all tsconfig files successfully.');
	} catch (error) {
		console.error('Error parsing YAML content:', error);
	}
}

// Function to find either tsconfig.yaml or tsconfig.yml file.
function findTsConfigYaml(cwd: string): string | null {
	const yamlFile = path.join(cwd, 'tsconfig.yaml');
	const ymlFile = path.join(cwd, 'tsconfig.yml');

	consoleLogger.info('Looking for tsconfig.yaml file...');
	if (fs.existsSync(yamlFile)) return yamlFile;
	consoleLogger.info('Looking for tsconfig.yml file...');
	if (fs.existsSync(ymlFile)) return ymlFile;

	return null;
}

// Function to generate individual project's tsconfig.json file.
function generateProjectTsConfig(
	dir: string,
	projectName: string,
	project: ProjectConfig,
	config: TsConfigYaml,
) {
	// Construct base options with overrides from specific configurations.
	const baseOptions = {
		...getBaseOptions(config),
		...getaspectOptions(projectName, config),
	};

	// Create references array based on provided references in YAML.
	const references = project.references?.map((ref) => ({ path: `./${ref}` })) || [];

	// Write out the generated configuration to a file.
	writeTsConfigJson(path.join(dir, project.path, 'tsconfig.json'), {
		...baseOptions,
		references,
	});
}

// Function to generate individual aspect's tsconfig.<aspect>.json file.
function generateaspectTsConfig(
	dir: string,
	projectName: string,
	aspectName: string,
	config: TsConfigYaml,
) {
	const baseOptions = getBaseOptions(config);

	// Merge base options with specific aspect options.
	const aspectOptions = getaspectOptions(aspectName, config);

	// Construct final options object by merging base and specific options.
	const finalOptions = { ...baseOptions, ...aspectOptions };

	// Write out the generated configuration to a file named after the sub-project.
	writeTsConfigJson(
		path.join(dir, config.projects[projectName].path, `tsconfig.${aspectName}.json`),
		finalOptions,
	);
}

// Helper function to get base options from global configuration options section.
function getBaseOptions(config: TsConfigYaml): BaseOptions {
	return config.options.base || {};
}

// Helper function to get specific sub-project options from global configuration section.
function getaspectOptions(aspectKey: string, config: TsConfigYaml): AspectConfig {
	return config.aspects[aspectKey] || {};
}

// Helper function to write JSON content into a .json file at specified path.
function writeTsConfigJson(filePath: string, jsonContent: Record<string, unknown>) {
	consoleLogger.debug('Ensuring directory exists:', filePath);
	ensureDirectoryExists(filePath);

	consoleLogger.info('Writing tsconfig to file:', filePath);
	consoleLogger.debug('With content:', jsonContent);
	fs.writeFileSync(filePath, JSON.stringify(jsonContent, undefined, '\t'), {
		encoding: 'utf8',
		flag: 'w',
	});
}

function ensureDirectoryExists(filePath: string) {
	if (!path.isAbsolute(filePath)) {
		throw new Error('Path must be absolute: ' + filePath);
	}

	const dirname = path.dirname(filePath);
	if (fs.existsSync(dirname)) {
		return true;
	}

	consoleLogger.info('Creating directory:', dirname);
	fs.mkdirSync(dirname, { recursive: true });
}

function toAbsolute(dir: string): string {
	return path.isAbsolute(dir) ? dir : path.resolve(process.cwd(), dir);
}

if (process.argv.includes('watch')) {
	const dir = process.argv[3];
	chokidar
		.watch([path.join(dir, 'tsconfig.yaml'), path.join(dir, 'tsconfig.yml')], {
			persistent: true,
		})
		.on('change', () => {
			consoleLogger.info('Detected changes in configuration files...');
			generateTsConfigs(dir);
		});
} else {
	const dir = process.argv[2];
	generateTsConfigs(dir);
}
