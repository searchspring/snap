# Snap

Welcome to Snap - Searchspring's SDK for integrating into front end web apps.

---

# Contributing

We invite your participation through issues and pull requests! Please reference Searchspring's [Community CONTRIBUTING.md](https://github.com/searchspring/community/blob/main/CONTRIBUTING.md)

# Packages
Snap packages that are published to NPM's registry are found under the `/packages` directory. 

Documentation for each package can be found in its respective README file

<details>
    <summary>Package dependencies hierarchy</summary>
    <br/>
    <img src="images/snap-dependencies.jpg"/>
</details>

## Client

<a href="https://www.npmjs.com/package/@searchspring/snap-client-javascript"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-client-javascript.svg?style=flat"></a>

[@searchspring/snap-client-javascript](packages/snap-client-javascript)

Simple Javascript client for communicating with Searchspring's API

## Component Library

A collection of interface elements for front end libraries
### React / Preact

<a href="https://www.npmjs.com/package/@searchspring/snap-preact-components"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-preact-components.svg?style=flat"></a>

[@searchspring/snap-preact-components](packages/snap-preact-components)

## Controller

<a href="https://www.npmjs.com/package/@searchspring/snap-controller"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-controller.svg?style=flat"></a>

[@searchspring/snap-controller](packages/snap-controller)

The heart of controlling Search, Autocomplete, & Finder functionallity

## Demo

A demo store utlizing all Snap packages and components. Check it out at [try.searchspring.com](http://try.searchspring.com/) or use it as a reference
<!-- TODO: Update try.searchspring.com to Snap deployed demostore -->

[@searchspring/snap-preact-demo](packages/snap-preact-demo)

## Event Manager

<a href="https://www.npmjs.com/package/@searchspring/snap-event-manager"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-event-manager.svg?style=flat"></a>

[@searchspring/snap-event-manager](packages/snap-event-manager)

Hook into custom events for modifying data

## Logger

<a href="https://www.npmjs.com/package/@searchspring/snap-logger"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-logger.svg?style=flat"></a>

[@searchspring/snap-logger](packages/snap-logger)

Simple logger for debugging

## Profiler

<a href="https://www.npmjs.com/package/@searchspring/snap-profiler"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-profiler.svg?style=flat"></a>

[@searchspring/snap-profiler](packages/snap-profiler)

A utility for profiling the performance of Snap features

## Store

<a href="https://www.npmjs.com/package/@searchspring/snap-store-mobx"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-store-mobx.svg?style=flat"></a>

[@searchspring/snap-store-mobx](packages/snap-store-mobx)

MobX state management

## Toolbox

<a href="https://www.npmjs.com/package/@searchspring/snap-toolbox"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-toolbox.svg?style=flat"></a>

[@searchspring/snap-toolbox](packages/snap-toolbox)

A collection of utility tools such as DOM targetting, currency formatting & browser feature flags

## URL Manager

<a href="https://www.npmjs.com/package/@searchspring/snap-url-manager"><img alt="NPM Status" src="https://img.shields.io/npm/v/@searchspring/snap-url-manager.svg?style=flat"></a>

[@searchspring/snap-url-manager](packages/snap-url-manager)

A standard API for URL management across all Snap products

# Quick Links

[Snap API docs](http://snapi.kube.searchspring.io/api/v1/) - Search & Autocomplete API documentation

[Snapi Explorer](https://searchspring.github.io/snapi-explorer/) - a tool for making requests to Searchspring's API.

# Prerequisite

## NPM v7.x

Npm v7.x is required for it's workspaces feature

Npm v7.7.0 is optional for executing scripts in workspaces
## ~/.npmrc

Only required if packages are still private. Replace `{token}` with a Github personal access token
```text
//npm.pkg.github.com/:_authToken={token}
registry=https://registry.npmjs.org/
```

# Commands
While at the <b>repo root</b>, the following commands are available:

## Install dependancies
```shell
npm install
```

## Dev
Executes `npm run dev` across all packages sequentially. All packages will be linked with hot reloading.
```shell
npm run dev
```
http://localhost:3333 Demo store

http://localhost:8888 Webpack bundle analyzer

## Storybook
http://localhost:6006
```shell
npm run storybook
```

## Unit Tests
```shell
npm run test
```

## Cypress E2E Tests
Only applies to `packages/snap-preact-demo`
```shell
npm run cypress
```

## Build
Executes `npm run build` across all packages sequentially. 
```shell
npm run build
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