# Vite Monorepo - TSConfig per project

## Steps to run
```sh
pnpm i
pnpm ui build
pnpm dev
```

## Details
- tsconfig per package + workspace solution style tsconfig.
- `ui` package is built in Vite's lib mode and must be built prior to running the app.
- changes to `ui` lib will not be watched by Vite's devserver.


## Pros
- Dependencies work in the way most tools expect them to - the package json
  builds the source into a dist folder, pnpm symlinks the folder, and the app
  picks up the compiled code just like any other dependency.
- Very flexible, each package can have it's own dependencies.

## Cons
- A lot more configuration is required. Every package requires:
  - at least 2 tsconfig files, likely 3 once you add tests.
  - it's own build/test configuration (vite/vitest)
- Changes to library code will not be watched by Vite's devserver
- Likely requires a monorepo manager to manage building deps in order and
  watching for changes.
