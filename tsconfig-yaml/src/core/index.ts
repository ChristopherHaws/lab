import type { FileSystem, Logger } from '@/utils/types';
import { tsconfigGenerator } from './generateTsConfig';

export function createTsConfigGenerator(fs: FileSystem, logger: Logger) {
	return tsconfigGenerator(fs, logger);
}
