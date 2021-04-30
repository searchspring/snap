# Snap

Welcome to Snap - Searchspring's SDK for integrating into front end web apps.

---

# Contributing

We invite your participation through issues, discussions and pull requests! Please reference Searchspring's [Community Contribution Guidelines](https://github.com/searchspring/community/blob/main/CONTRIBUTING.md).

# Packages
Snap packages that are published to NPM's registry are found under the `/packages` directory. 

Documentation for each package can be found in its respective README file.

<details>
	<summary>Package dependencies hierarchy</summary>
	<br/>
	<img src="images/snap-dependencies.jpg"/>
</details>

<br>

## Client

[@searchspring/snap-client-javascript](packages/snap-client-javascript) <a href="https://www.npmjs.com/package/@searchspring/snap-client-javascript"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-client-javascript.svg?style=flat"></a>

Simple Javascript client for communicating with Searchspring's API

## Component Libraries

A collection of interface elements for front end libraries
### React / Preact

[@searchspring/snap-preact-components](packages/snap-preact-components) <a href="https://www.npmjs.com/package/@searchspring/snap-preact-components"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-preact-components.svg?style=flat"></a>


## Controller

[@searchspring/snap-controller](packages/snap-controller) <a href="https://www.npmjs.com/package/@searchspring/snap-controller"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-controller.svg?style=flat"></a>

The heart of controlling Search, Autocomplete, & Finder functionality

## Demo Stores

A demo store utilizing all Snap packages and components.
### React / Preact
Check it out at [try.searchspring.com](http://try.searchspring.com/) or use it as a reference
<!-- TODO: Update try.searchspring.com to Snap deployed demostore -->

[@searchspring/snap-preact-demo](packages/snap-preact-demo)

## Event Manager

[@searchspring/snap-event-manager](packages/snap-event-manager) <a href="https://www.npmjs.com/package/@searchspring/snap-event-manager"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-event-manager.svg?style=flat"></a>

Hook into custom events for modifying data

## Logger

[@searchspring/snap-logger](packages/snap-logger) <a href="https://www.npmjs.com/package/@searchspring/snap-logger"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-logger.svg?style=flat"></a>

Simple logger for debugging

## Profiler

[@searchspring/snap-profiler](packages/snap-profiler) <a href="https://www.npmjs.com/package/@searchspring/snap-profiler"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-profiler.svg?style=flat"></a>

A utility for profiling the performance of Snap features

## Store

[@searchspring/snap-store-mobx](packages/snap-store-mobx) <a href="https://www.npmjs.com/package/@searchspring/snap-store-mobx"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-store-mobx.svg?style=flat"></a>

MobX state management

## Toolbox

[@searchspring/snap-toolbox](packages/snap-toolbox) <a href="https://www.npmjs.com/package/@searchspring/snap-toolbox"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-toolbox.svg?style=flat"></a>

A collection of utility tools such as DOM targetting, currency formatting & browser feature flags

## URL Manager

[@searchspring/snap-url-manager](packages/snap-url-manager) <a href="https://www.npmjs.com/package/@searchspring/snap-url-manager"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-url-manager.svg?style=flat"></a>

A standard API for URL management across all Snap products

# Quick Links

[Snap API docs](https://searchspring.github.io/snapi-oas/) - Search & Autocomplete API documentation

[Snapi Explorer](https://searchspring.github.io/snapi-explorer/) - a tool for making requests to Searchspring's API.

# Prerequisite

## NPM v7.x

Npm v7.x is required for its workspaces feature

Npm v7.7.0 is optional for executing scripts in workspaces
## ~/.npmrc

Only required if packages are still private. Replace `{token}` with a Github personal access token
```text
//npm.pkg.github.com/:_authToken={token}
registry=https://registry.npmjs.org/
```

# Commands
While at the <b>repo root</b>, the following commands are available:

## Install dependencies
```shell
npm install
```

## Build
Executes `npm run build` across all packages sequentially. 
```shell
npm run build
```
## Dev
Executes `npm run dev` across all packages sequentially. All packages will be linked with hot reloading.
```shell
npm run dev
```

Demo store: http://localhost:4444

Webpack bundle analyzer: http://localhost:8888

## Docs
Serves the contents of the root directory to allow you to view the docs

Docs: http://localhost:2222/

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
Removes all package and root `node_modules` directories
```shell
npm run clean
```

## Execute common package.json script in all workspaces
```shell
npm run <command> --workspaces
```

## Execute package.json script within single workspace
```shell
npm run <command> [--workspace=<package> | -w <package>] [--workspace=<package> | -w <package>]
```
