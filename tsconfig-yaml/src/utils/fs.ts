import * as nodefs from 'fs';
import { FileSystem } from './types';

export const nodeFileSystem: FileSystem = {
	readFileSync: (path: string) => nodefs.readFileSync(path, 'utf-8'),
	writeFileSync: (path: string, data: string) => nodefs.writeFileSync(path, data),
	existsSync: (path: string) => nodefs.existsSync(path),
};

export const dryRunFileSystem: FileSystem = {
	...nodeFileSystem,
	writeFileSync: (path: string, data: string) =>
		console.log('Dry run: writing to', path, 'with data:', data),
};
