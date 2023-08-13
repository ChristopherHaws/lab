import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const currentDir = fileURLToPath(new URL('.', import.meta.url));

// https://vitejs.dev/guide/build.html#library-mode
export default defineConfig({
	// This ensures that vite runs in the current directory when
	// running via `pnpm dev` from the workspace root.
	root: resolve(currentDir),
	plugins: [
		// This plugin enables React Fast Refresh when running in
		// dev mode. Alternatively, use `reactSwr()` for faster but
		// less reliable builds (uses rust instead of babel).
		react(),
		// This plugin ensures that react and react-dom are not bundled
		// with the library but are instead treated as peer dependencies.
		// createExternal({
		// 	externals: {
		// 		react: 'React',
		// 		'react-dom': 'ReactDOM',
		// 	},
		// }),
		// This plugin generates types from the TypeScript source
		// files so they can be used by other packages and apps.
		dts(),
	],
	// resolve: {
	// 	// Forces vite to not follow symlinks to their original location. PNPM symlinks local dependency
	// 	// packages into the `node_modules` folder and vite follows these symlinks by default. This
	// 	// causes problems when vite tries to resolve local packages because they are outside the
	// 	// root directory of the current package.json.
	// 	//
	// 	// - Example (true):   @acme/ui/* -> /node_modules/@acme/ui/*
	// 	// - Example (false):  @acme/ui/* -> ../../packages/ui/*
	// 	preserveSymlinks: true,
	// },
	build: {
		// Ensure that the output dir is emptied before each build.
		emptyOutDir: true,
		// Ensure that the public dir is copied to the output dir so
		// they can be used by consumers of the lib.
		copyPublicDir: true,
		sourcemap: true,
		lib: {
			entry: resolve(currentDir, 'src/index.ts'),
			// The default name is the package name. We want to use
			// the name index.js because it's more consistent.
			fileName: 'index',
			formats: ['es'],
		},
		rollupOptions: {
			// make sure to externalize deps that shouldn't be bundled
			// into your library
			external: ['react', 'react-dom'],
			output: {
				// Provide global variables to use in the UMD build
				// for externalized deps
				globals: {
					react: 'React',
					'react-dom': 'ReactDOM',
				},
			},
		},
	},
});
