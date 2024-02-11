/// <reference types="@types/node" />
import { defineConfig } from 'tsup';
const ci = process.env.NODE_ENV == 'ci';

export default defineConfig({
	format: ['cjs', 'esm'],
	clean: true,
	ignoreWatch: ['**/node_modules', '**/dist', '**/samples'],
	entry: ['src/cli/index.ts', 'src/core/index.ts', 'src/utils/index.ts'],
	// entry: {
	// 	cli: 'src/cli/index.ts',
	// 	lib: 'src/core/index.ts',
	// },
	outDir: 'dist',
	outExtension({ format }) {
		return {
			js: format === 'cjs' ? '.cjs' : '.mjs',
		};
	},
	sourcemap: true,
	//dts: ci,
	experimentalDts: ci,
	minify: ci,
	keepNames: !ci,
});
