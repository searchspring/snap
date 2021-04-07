# Snap

All snap packages that are published to npm are found under the `/packages` directory. Documentation for each can be found in their respective README files:

## Package Documentation
[@searchspring/snap-client-javascript](packages/snap-client-javascript/README.md)

[@searchspring/snap-controller](packages/snap-controller/README.md)

[@searchspring/snap-event-manager](packages/snap-event-manager/README.md)

[@searchspring/snap-logger](packages/snap-logger/README.md)

[@searchspring/snap-preact-components](packages/snap-preact-components/README.md)

[@searchspring/snap-preact-demo](packages/snap-preact-demo/README.md)

[@searchspring/snap-profiler](packages/snap-profiler/README.md)

[@searchspring/snap-store-mobx](packages/snap-store-mobx/README.md)

[@searchspring/snap-toolbox](packages/snap-toolbox/README.md)

[@searchspring/snap-url-manager](packages/snap-url-manager/README.md)

## Prerequisite
### NPM v7.x
Npm v7.x is required for it's workspaces feature
Npm v7.7.0 is optional for executing scripts in workspaces
### ~/.npmrc
Only required if packages are still private. Replace `{token}` with a Github personal access token
```
//npm.pkg.github.com/:_authToken={token}
registry=https://registry.npmjs.org/
```

## Commands
While at the <b>repo root</b>, the following commands are available:
### Install dependancies
```
npm install
```
### Dev
Executes `npm run dev` across all packages sequentially. All packages will be linked with hot reloading.
```
npm run dev
```
http://localhost:3333 Demo store

http://localhost:8888 Webpack bundle analyzer

### Storybook
http://localhost:6006
```
npm run storybook
```
### Unit Tests
```
npm run test
```
### Cypress E2E Tests
Only applies to `packages/snap-preact-demo`
```
npm run cypress
```
### Build
Executes `npm run build` across all packages sequentially. 
```
npm run build
```
### Clean
Removes all package and root `node_modules` directories
```
npm run clean
```
### Execute common package.json script in all workspaces
```
npm run <command> --workspaces
```

### Execute package.json script within single workspace
```
npm run <command> [--workspace=<package> | -w <package>] [--workspace=<package> | -w <package>]
```