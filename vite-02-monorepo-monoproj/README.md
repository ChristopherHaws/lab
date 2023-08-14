# Vite Monorepo - TSConfig per Workspace

## Steps to run
```sh
pnpm i
pnpm dev
```

## Details
- Single set of tsconfigs in the root of the workspace.
- Vite configured for apps
- Vitest configured for apps and libs
- Vitest Workspace placed in the root of the workspace


## Pros
- Packages do not require their own tsconfig
- Packages do not need to be built in vite's lib mode because the app is going to build the source code
  - NOTE: You can still build them in lib mode if you want to distribute or use them outside of the vite app
- HMR and reloads work as expected when making changes in library code

## Cons
- You need to configure vite and typescript to understand your project structure (paths)
- Cyclic dependencies can happen easier - eslint can be configured to catch these
