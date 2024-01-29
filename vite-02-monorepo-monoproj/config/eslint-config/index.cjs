module.exports = {
	root: true,
	env: { browser: true, es2020: true },
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:react-hooks/recommended',
	],
	ignorePatterns: ['dist', '.eslintrc.cjs'],
	parser: '@typescript-eslint/parser',
	plugins: ['react-refresh'],
	rules: {
		'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
	},
	overrides: [
		{
			files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
			parser: '@typescript-eslint/parser',
			// https://typescript-eslint.io/packages/typescript-estree/
			parserOptions: {
				// sourceType: 'module',
				// ecmaVersion: 2022,
				// tsconfigRootDir: __dirname,

				// If using experimental shared TypeScript server, configure it here (be cautious as it's experimental)
				// https://github.com/typescript-eslint/typescript-eslint/pull/6754
				EXPERIMENTAL_useProjectService: true,

				// https://typescript-eslint.io/linting/typed-linting/monorepos/#one-tsconfigjson-per-package-and-an-optional-one-in-the-root
				// project: ['./tsconfig.json'],
			},
		},
	],
};
