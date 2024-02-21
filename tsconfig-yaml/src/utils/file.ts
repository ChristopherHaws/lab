import fs from 'fs';
import path from 'path';

export function findTsConfigYaml(dir: string): string | null {
	dir = path.resolve(dir);
	if (path.extname(dir) !== '') {
		dir = path.dirname(dir);
	}

	const yamlFile = path.join(dir, 'tsconfig.yaml');
	const ymlFile = path.join(dir, 'tsconfig.yml');

	if (fs.existsSync(yamlFile)) return yamlFile;
	if (fs.existsSync(ymlFile)) return ymlFile;

	return null;
}
