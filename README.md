# Lab

This repo is a place for me to play around with different tech without needing to create a new git repo everytime.

## Vite Monorepo Samples

### Samples

| Folder                                                       | Description                                                                                                                                                                                               |
| ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [/vite-01-monorepo-multiproj](./vite-01-monorepo-multiproj/) | - tsconfigs per subproject<br/>- vite/vitest config per subproject<br/>- packages need to build in lib mode for local dev<br/>- hmr only works on code in the app subfolder because the libs are prebuilt |
| [/vite-02-monorepo-monoproj](./vite-02-monorepo-monoproj/)   | - tsconfigs per workspace<br/>- vite/vitest config per app<br/>- packages dont need vite installed<br/>- hmr works on all the local packages                                                              |

### Possible other things to try

-   Something to try is to tell pnpm to hard link the local deps instead of symlinking them:

    ```json
    // https://pnpm.io/package_json#dependenciesmetainjected
    "dependenciesMeta": {
      "@acme/ui": {
        "injected": true
      }
    }
    ```

-   Try setting `auto-install-peers = true` in `.npmrc`

### Relevant Links

-   https://github.com/vitejs/vite/issues/5668
