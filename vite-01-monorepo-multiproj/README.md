# Vite Monorepo - TSConfig per project

## Steps to run
```sh
pnpm i
pnpm ui build
pnpm dev
```

## Details
- tsconfig per package + workspace solution style tsconfig
- ui builds in lib mode and must be built prior to running the app
- changes to ui lib will not hmr or be watched

## Notes
- This monorepo would benefit from a more robust monorepo manager to manage
  building deps in order and watching for changes. Would make the dev experience
  a little better
