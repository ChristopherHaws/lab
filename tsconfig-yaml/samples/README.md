# Requirements

uses pnpm workspaces, vite, vitest, and storybook
uses react as the component library
multiple apps: app1 and app2 for example
a single storybook instance, shared between the apps and all of the libs
multiple shared modules: ui, utils, loc, ui, etc
tests, stories, types, etc should live within the same src folder on disk but using different file suffixes to differentiate them
each set of files can only access the types it should have access to for example:
  the apps should only have access to types, but not tests, stories, mocks, etc.
  the tests should have access to types, apps, mocks, etc, but not stories

# Problem
The current solution for managing the tsconfig files is to manually create and maintain each tsconfig file, and manually configure the include and exclude rules for each. This solution is time-consuming, error-prone, and makes it difficult to maintain consistency across all projects. It also makes it difficult to add new projects or modules to the existing project structure, as each new project or module requires at least one (but often 5 or more) new tsconfig file. This problem is exacerbated when using a tool like Vite or Storybook, which require their own tsconfig file, and these files must be kept in sync with the main tsconfig file. This problem is also exacerbated when using a tool like Vitest, which requires its own global types to be available to all tests, and these types must also be kept in sync with the main tsconfig file.

The resulting project structure is often overly complex and difficult to understand, making it difficult for new developers to get up to speed, and making it difficult for experienced developers to maintain and extend the existing project structure.

For example, if you are willing to sacrafice reliable intellisense and type safety, you might have a project structure like this:
```
workspace
├── app1
│   ├── src
│   │   ├── app1.ts
│   │   ├── app1.tests.ts
│   │   ├── app1.stories.ts
│   │   └── app1.types.ts
│   └── tsconfig.app1.json
├── app2
│   ├── src
│   │   ├── app2.ts
│   │   ├── app2.tests.ts
│   │   ├── app2.stories.ts
│   │   └── app2.types.ts
│   └── tsconfig.app2.json
├── shared
│   ├── ui
│   │   ├── src
│   │   │   ├── ui.ts
│   │   │   ├── ui.tests.ts
│   │   │   ├── ui.stories.ts
│   │   │   └── ui.types.ts
│   │   └── tsconfig.ui.json
│   ├── utils
│   │   ├── src
│   │   │   ├── utils.ts
│   │   │   ├── utils.tests.ts
│   │   │   ├── utils.stories.ts
│   │   │   └── utils.types.ts
│   │   └── tsconfig.utils.json
│   └── tsconfig.shared.json
├── tsconfig.json
├── tsconfig.vite.json
├── tsconfig.storybook.json
└── tsconfig.vitest.json
```

Or if you want more accurate intellisense and type safety, you would need to typescript project references and solution tsconfig files with references to all of the project tsconfig's. The resulting project structure might look something like this:
```shell
.
├── apps
│   ├── app1
│   │   ├── src
│   │   │   ├── index.ts
│   │   │   ├── app1.ts
│   │   │   ├── app1.mocks.ts
│   │   │   ├── app1.stories.ts
│   │   │   ├── app1.tests.ts
│   │   │   └── app1.types.ts
│   │   ├── tsconfig.json
│   │   ├── tsconfig.app1.json
│   │   ├── tsconfig.app1.mocks.json
│   │   ├── tsconfig.app1.storybook.json
│   │   ├── tsconfig.app1.vite.json
│   │   ├── tsconfig.app1.vitest.json
│   │   ├── vite.config.ts
│   │   └── package.json
│   └── app2
│       ├── src
│       │   ├── index.ts
│       │   ├── app2.ts
│       │   ├── app2.mocks.ts
│       │   ├── app2.stories.ts
│       │   ├── app2.tests.ts
│       │   └── app2.types.ts
│       ├── tsconfig.json
│       ├── tsconfig.app2.json
│       ├── tsconfig.app2.mocks.json
│       ├── tsconfig.app2.storybook.json
│       ├── tsconfig.app2.vite.json
│       ├── tsconfig.app2.vitest.json
│       ├── vite.config.ts
│       └── package.json
└── libs
    ├── ui
    │   ├── src
    │   │   ├── index.ts
    │   │   ├── ui.ts
    │   │   ├── ui.mocks.ts
    │   │   ├── ui.stories.ts
    │   │   ├── ui.tests.ts
    │   │   └── ui.types.ts
    │   ├── tsconfig.json
    │   ├── tsconfig.ui.json
    │   ├── tsconfig.ui.mocks.json
    │   ├── tsconfig.ui.storybook.json
    │   ├── tsconfig.ui.vite.json
    │   └── tsconfig.ui.vitest.json
    ├── utils
    │   ├── src
    │   │   ├── index.ts
    │   │   ├── utils.ts
    │   │   ├── utils.mocks.ts
    │   │   ├── utils.stories.ts
    │   │   ├── utils.tests.ts
    │   │   └── utils.types.ts
    │   ├── tsconfig.json
    │   ├── tsconfig.utils.json
    │   ├── tsconfig.utils.mocks.json
    │   ├── tsconfig.utils.storybook.json
    │   ├── tsconfig.utils.vite.json
    │   └── tsconfig.utils.vitest.json
    ├── tsconfig.json
    └── tsconfig.shared.json
```

Four simple projects results in 24 config files to maintain and the problem gets worse with every new project and package added to the workspace.


# Ideal Project Structure
In an ideal world, where typescript had a better configuration system, the project structure might look something like this:
```shell
workspace
├── apps
│   ├── app1
│   │   ├── pages
│   │   │   ├── page1
│   │   │   │   ├── index.tsx
│   │   │   │   ├── page1.tsx
│   │   │   │   ├── page1.mocks.ts
│   │   │   │   ├── page1.stories.ts
│   │   │   │   ├── page1.tests.ts
│   │   │   │   └── page1.types.ts
│   │   │   └── page2
│   │   │       ├── index.tsx
│   │   │       ├── page2.tsx
│   │   │       ├── page2.mocks.ts
│   │   │       ├── page2.stories.ts
│   │   │       ├── page2.tests.ts
│   │   │       └── page2.types.ts
│   │   ├── app.ts
│   │   ├── index.html
│   │   ├── index.ts
│   │   └── main.ts
│   └── app2
│       ├── pages
│       │   ├── page1
│       │   │   ├── index.tsx
│       │   │   ├── page1.tsx
│       │   │   ├── page1.mocks.tsx
│       │   │   ├── page1.stories.tsx
│       │   │   ├── page1.tests.tsx
│       │   │   └── page1.types.ts
│       │   └── page2
│       │       ├── index.tsx
│       │       ├── page2.tsx
│       │       ├── page2.mocks.tsx
│       │       ├── page2.stories.tsx
│       │       ├── page2.tests.tsx
│       │       └── page2.types.ts
│       ├── app.ts
│       ├── index.html
│       ├── index.ts
│       └── main.ts
├── libs
│   ├── ui
│   │   ├── component1
│   │   │   ├── index.ts
│   │   │   ├── component1.tsx
│   │   │   ├── component1.mocks.tsx
│   │   │   ├── component1.stories.tsx
│   │   │   ├── component1.tests.tsx
│   │   │   └── component1.types.ts
│   │   ├── component2
│   │   │   ├── index.ts
│   │   │   ├── component2.tsx
│   │   │   ├── component2.mocks.tsx
│   │   │   ├── component2.stories.tsx
│   │   │   ├── component2.tests.tsx
│   │   │   └── component2.types.ts
│   │   └── index.ts
│   └── utils
│       ├── util1
│       │   ├── index.ts
│       │   ├── util1.ts
│       │   ├── util1.mocks.ts
│       │   ├── util1.tests.ts
│       │   └── util1.types.ts
│       ├── util2
│       │   ├── index.ts
│       │   ├── util2.ts
│       │   ├── util2.mocks.ts
│       │   ├── util2.tests.ts
│       │   └── util2.types.ts
│       └── index.ts
├── .pnpmfile.cjs
├── tsconfig.yaml
├── vite.config.mts
├── package.json
└── pnpm-workspace.yaml
```

# Solution
tsconfig-yaml is a configuration file that allows you to define the project structure in a single file, using a simple human-readable YAML syntax. This configuration file is then used to generate the required tsconfig.json and tsconfig.*.json files for each project which can be excluded from your IDE and version control system. A simple vscode task can be used to generate these files when they are needed or monitor for changes to the tsconfig-yaml file and then run the generator task automatically.


# Example Configuration
```yaml
# tsconfig.yaml
projects:
  apps/app1:
	references: shared/*
  apps/app2:
	references: shared/*
  libs/ui:
	references: shared/*
  libs/utils:
	references: shared/*
  libs/loc:
	references: shared/*

projects:
  apps/app1:
	can reference: shared/*
	types: vite/client, react, react-dom
	includes: **/*.{ts,tsx,mts}
	excludes: **/*.{ts,tsx,mts}
	accesses: types

  apps/app2:
	can reference: shared/*
	types: vite/client, react, react-dom
	includes:
	  - *.tsx
	  - *.ts
	  - *.mts
	excludes:
	  - *.*.ts
	  - *.*.tsx
	  - *.*.mts
	can access: types

  libs/ui:
	can reference: shared/*
	types: vite/client, react, react-dom
	includes:
	  - *.tsx
	  - *.ts
	  - *.mts
	excludes:
	  - *.*.ts
	  - *.*.tsx
	  - *.*.mts
	can access: types

  libs/utils:
	can reference: shared/*
	types: vite/client
	includes:
	  - *.tsx
	  - *.ts
	  - *.mts
	excludes:
	  - *.*.ts
	  - *.*.tsx
	  - *.*.mts
	can access: types
```


# English Explination
```yaml
# tsconfig.yaml
projects:
  app1:
  can reference: shared/*

  site-two:
  can reference: shared/*

  shared:
    ui:
    utils:

each project contains the configurations:
  app:
  description: the actual application which renders on the client
  includes: *.{ts,tsx,mts} files
  excludes: *.*.{ts,tsx,mts} files (tests, storybook, mocks, etc)
  can access: types
  types: react, react-dom, vite/client

  types:
  description: the domain and utility types for the project, shared between all files
  includes: *.types.{ts,tsx,mts} files
  can access: types
  types: vite/client

  tests:
  includes: *.tests.{ts,tsx,mts} files
  can access: types, app, mocks, tests
  types: react, react-dom, vite/client, vitest/global

  stories:
  includes: *.stories.{ts,tsx,mts} files
  can access: types, app, mocks, stories
  types: react, react-dom, vite/client, vitest/global, storybook

  mocks:
  include: *.mocks.{ts,tsx,mts} files
  can access: types, app
  types: react, react-dom, vite/client, vitest/global
```