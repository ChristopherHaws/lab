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

-   [Problem with Vite and CommonJS package in monorepo (Vite #5668)](https://github.com/vitejs/vite/issues/5668)
-   [You might not need TypeScript project references](https://turbo.build/blog/you-might-not-need-typescript-project-references)
-   [How to set up a TypeScript monorepo and make Go to definition work](https://medium.com/@NiGhTTraX/how-to-set-up-a-typescript-monorepo-with-lerna-c6acda7d4559)
-   [Making TypeScript monorepos play nice with other tools](https://medium.com/@NiGhTTraX/making-typescript-monorepos-play-nice-with-other-tools-a8d197fdc680)
-   [Template project for setting up a TypeScript monorepo (internal packages)](https://github.com/NiGhTTraX/ts-monorepo)
-   [Template project for setting up a TypeScript monorepo (project references)](https://github.com/NiGhTTraX/ts-monorepo/tree/project-references)
-   [A guide through The Wild Wild West of setting up a mono repo with TypeScript, Lerna and Yarn Workspaces](https://blog.ah.technology/a-guide-through-the-wild-wild-west-of-setting-up-a-mono-repo-with-typescript-lerna-and-yarn-ed6a1e5467a)
