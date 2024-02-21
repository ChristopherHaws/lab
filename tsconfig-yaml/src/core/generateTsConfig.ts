import type { TsConfigYaml } from './types';
import type { FileSystem, Logger } from '@/utils/types';
import path from 'path';
import braces from 'braces';

export const tsconfigGenerator =
	(fs: FileSystem, logger: Logger) =>
	(config: TsConfigYaml, outputPath: string): Promise<void> => {
		logger.info('Generating tsconfig files in:', outputPath);

		for (const [projectName, project] of Object.entries(config.projects)) {
			for (const environmentName of project.environments) {
				logger.info('Generating tsconfig files for:', `${projectName}:${environmentName}`);
				const environment = config.environments[environmentName];

				const tsconfig = {
					extends: environment.extends,
					references: environment.references,
					include: environment.include.flatMap(braces.expand),
					types: environment.types,
				};

				// Write the tsconfig to a file
				const tsconfigPath = path.join(
					outputPath,
					projectName,
					`tsconfig.${environmentName}.json`,
				);

				logger.info('Writing tsconfig:', tsconfigPath);
				logger.debug('tsconfig:', tsconfig);
				fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
			}
		}

		return Promise.resolve();
	};
