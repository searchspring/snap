<p align="center">
  <img src="images/flat-logo-snap.svg"/>  
</p>
<br/><br/>

# Snap 1.0

Welcome to Snap - Searchspring's SDK for integrating into front end web apps. We invite your participation through issues, discussions and pull requests! Please reference Searchspring's [Community Contribution Guidelines](https://github.com/searchspring/community/blob/main/CONTRIBUTING.md).

Please reference the [Snap Documentation](https://searchspring.github.io/snap/) to get started using Snap to build applications.

# Packages
The Snap mono-repo publishes multiple packages to NPM's registry; packages are versioned together, and it is recommended to utilize packages of the same exact versioning.

Documentation for each package can be found in its respective README file (`/packages/`).

# Prerequisite

## Node.js
We recommend usage of Node.js v16 or higher.
## NPM v7.x

NPM v7.x is required for its workspaces feature

NPM v7.7.0 is optional for executing scripts in workspaces

# Commands
While at the <b>repo root</b>, the following commands are available:

## Install dependencies
```shell
npm install
```

## Build
Executes `npm run build` across all packages sequentially
```shell
npm run build
```
## Dev
Executes `npm run dev` across all packages sequentially. All packages will be linked with hot reloading
```shell
npm run dev
```

Demo store: https://localhost:2222

## Docs
Serves the contents of the root directory to allow you to view the docs

Docs: http://localhost:1111/

```shell
npm run dev:docs
```

## Commit
Instead of using `git commit`, use `npm run commit` to utilize Commitizen
```shell
npm run commit
```

## Storybook Components
Preact Components: http://localhost:6006
```shell
npm run storybook:preact
```

## Tests (unit + headless E2E)
```shell
npm run test
```

## Cypress E2E Tests
Only applies to `packages/snap-preact-demo`
```shell
npm run cypress
```

## Clean
Removes all package and root `node_modules` directories and package-lock.json; additionally removes generated documentation and test coverage data.
```shell
npm run clean
```

