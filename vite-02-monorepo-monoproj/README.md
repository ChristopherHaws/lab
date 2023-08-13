# Version 1

## Details
- tsconfig per package + workspace solution style tsconfig
- ui builds in lib mode and must be built prior to running the app
- changes to ui lib will not hmr or be watched

## Notes

- Something to try is to tell pnpm to hard link the local deps instead of symlinking them:
  ```json
  // https://pnpm.io/package_json#dependenciesmetainjected
  "dependenciesMeta": {
    "@acme/ui": {
      "injected": true
    }
  }
  ```

- Setup UI lib to have different publishConfig (not sure if this is only for publishing to a
  registry or if pnpm/vite uses that field when resolving from node_modules):

  ```json
  // https://pnpm.io/package_json#publishconfig
  {
    "name": "foo",
    "version": "1.0.0",
    "main": "src/index.ts",
    "publishConfig": {
        "main": "dist/index.js",
        "typings": "dist/index.d.ts"
    }
  }
  ```

- Try setting `auto-install-peers = true` in `.npmrc`


## Relevant Links

- https://github.com/vitejs/vite/issues/5668



# Vite Info

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

-   [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
-   [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

-   Configure the top-level `parserOptions` property like this:

```js
   parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
   },
```

-   Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
-   Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
-   Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
