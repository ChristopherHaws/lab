import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

import packageJson from './package.json';

const currentDir = fileURLToPath(new URL('.', import.meta.url));
const dependencies = Object.keys(packageJson['dependencies'] || {});
const peerDependencies = Object.keys(packageJson['peerDependencies'] || {});

// https://vitejs.dev/guide/build.html#library-mode
export default defineConfig({
	// Run in the directory this file is located in when running
	// via `pnpm dev` from the workspace root.
	root: resolve(currentDir),
	appType: 'custom',
	plugins: [
		// This plugin enables React support for Vite. It handles
		// both JSX and TSX files.
		react(),

		// This plugin generates types from the TypeScript source
		// files so they can be used by other packages and apps.
		dts({
			// Merge all declarations into one file
			rollupTypes: true,
		}),
	],
	build: {
		// Ensure that the public dir is copied to the output dir so
		// they can be used by consumers of the lib.
		copyPublicDir: true,
		sourcemap: true,
		/**
		 * Configure vite to build the project in "lib mode".
		 */
		lib: {
			entry: resolve(currentDir, 'src/index.ts'),
			fileName: 'index.mjs',
			formats: ['es'],
		},
		//minify: process.env.NODE_ENV === 'production',
		rollupOptions: {
			/**
			 * The "external" option is used to specify which modules should be
			 * treated as external dependencies and thus should not be bundled
			 * together with the rest of the code. Instead of including the
			 * code for these modules in the bundle, they will be left as import
			 * or require statements, and it will be up to the consumer to ensure
			 * that they are available in the environment where the code is run.
			 * @see https://rollupjs.org/configuration-options/#external
			 */
			//external: [...peerDependencies, 'react/jsx-runtime', 'react-dom/client'],
			external(source, importer, isResolved) {
				const externalize =
					// e.x. `react` or `react-dom`
					dependencies.includes(source) ||
					peerDependencies.includes(source) ||
					// e.x. `react/jsx-runtime` or `react-dom/client`
					dependencies.some(dep => source.startsWith(`${dep}/`));
				peerDependencies.some(dep => source.startsWith(`${dep}/`));

				if (externalize) {
					console.log('build:rollupOptions:external:', {
						source,
						importer,
						isResolved,
					});
				}

				return externalize;
			},
			output: {
				/**
				 * Tell Rollup that `react` is external and the `react` module
				 * ID equates to the global `React` variable
				 * @example `import React from 'react'` becomes `const React = window.React`
				 * @see https://rollupjs.org/configuration-options/#output-globals
				 */
				globals: {
					react: 'React',
					'react-dom': 'ReactDOM',
					'react/jsx-runtime': 'jsxs',
				},
			},
		},
	},
});
