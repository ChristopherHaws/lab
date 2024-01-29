import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPlugin from 'vite-tsconfig-paths';

const currentDir = fileURLToPath(new URL('.', import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
	//FIXME: Is this correct? I have a feeling this should be the workspace root, not the current package root.
	root: resolve(currentDir),
	plugins: [react(), tsconfigPlugin()],
});
