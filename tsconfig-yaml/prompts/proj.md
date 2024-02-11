Can you show me how you would structure the tsconfig files based on these requirements?

- use pnpm workspaces, vite [*.{ts,tsx,mts}], vitest, and storybook with react as the component library.
- We want two websites: site-one and site-two for example
- We want a single storybook, shared between the two sites and all of the libs
- We want multiple shared modules: auth, shared, utils, etc

We want tests, stories, types, etc to live within the same folder on disk, but using different file suffixes to differentiate them. What we want is to have each set of files have access to only the types it should. For example, the site should only have access to the types, and not the tests, stories, mocks, etc. The tests should have access to the types and site, but not the stories, mocks, etc. For example:

projects:
	site-one:
	- can reference: shared/*

	site-two:
	- can reference: shared/*

	shared:
		auth:
		utils:

each project contains the configurations:
	app:
	- description: the actual application which renders on the client
	- includes: *.{ts,tsx,mts} files
	- excludes: *.*.{ts,tsx,mts} files (tests, storybook, mocks, etc)
	- can access: types
	- types: react, react-dom, vite/client

	types:
	- description: the domain and utility types for the project, shared between all files
	- includes: *.types.{ts,tsx,mts} files
	- can access: types
	- types: vite/client

	tests:
	- includes: *.tests.{ts,tsx,mts} files
	- can access: types, app, mocks, tests
	- types: react, react-dom, vite/client, vitest/global

	stories:
	- includes: *.stories.{ts,tsx,mts} files
	- can access: types, app, mocks, stories
	- types: react, react-dom, vite/client, vitest/global, storybook

	mocks:
	- include: *.mocks.{ts,tsx,mts} files
	- can access: types, app
	- types: react, react-dom, vite/client, vitest/global
