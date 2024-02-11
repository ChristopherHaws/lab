#!/bin/env node
import { program } from '@commander-js/extra-typings';
import { createTsConfigGenerator } from '@/core';
import { dryRunFileSystem, nodeFileSystem } from '../utils/fs';
import { consoleLogger } from '../utils/logger';
import { TsConfigYaml } from '../core/types';
import yaml from 'yaml';
import path from 'path';

program
	.name('tsconfig-yaml')
	.description(
		'A tool to generate multiple tsconfig.json files from a single tsconfig.yaml file.',
	)
	.version('1.0.0-pre');

program
	.command('generate')
	.alias('gen')
	.description('Generates many tsconfig.json files from one tsconfig.yaml file')
	.argument('<file>', 'The tsconfig.yaml file')
	.option('--dry-run', 'perform a trial run with no changes made', false)
	.action(async (filePath, options) => {
		let dir = path.resolve(filePath);
		if (path.extname(dir) !== '') {
			dir = path.dirname(dir);
		}

		consoleLogger.info('Generating', dir, 'with options:', options);
		const fileSystem = options.dryRun ? dryRunFileSystem : nodeFileSystem;
		const tsconfigGenerator = createTsConfigGenerator(fileSystem, consoleLogger);

		const tsconfigYamlContent = fileSystem.readFileSync(path.join(dir, 'tsconfig.yml'));
		const tsconfigYaml = yaml.parse(tsconfigYamlContent) as TsConfigYaml;
		const tsconfigs = await tsconfigGenerator(tsconfigYaml, dir);
		consoleLogger.debug('Generated tsconfigs:', tsconfigs);
	});

program
	.command('watch')
	.alias('dev')
	.description('Generates many tsconfig.json files from one tsconfig.yaml file')
	.argument('<file>', 'The tsconfig.yaml file')
	.option('--dry-run', 'perform a trial run with no changes made', false)
	.action((filePath, options) => {
		console.log('Watching', filePath, 'for change with options:', options);
		createTsConfigGenerator(options.dryRun ? dryRunFileSystem : nodeFileSystem, consoleLogger);
	});

program.parse(process.argv);
