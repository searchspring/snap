# Snap

All snap packages that are published to npm are found under the `/packages` directory

Yarn workspaces is used to hoist package dependancies to the root `node_modules` directory

Lerna is used to execute commands across the packages. See commands below or in the root `package.json`

## Prerequisite
### ~/.npmrc 
Only required if packages are still private. Replace `{token}` with a Github personal access token
```
@searchspring:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken={token}
registry=https://registry.npmjs.org/
```

## Commands
While at the <b>repo root</b>, the following commands are available:
### Install dependancies
```
yarn run setup
```
### Dev
Executes `yarn run dev` across all packages sequentially. All packages will be linked with hot reloading.
```
yarn run dev
```
http://localhost:3333 Demo store

http://localhost:8888 Webpack bundle analyzer

### Storybook
http://localhost:6006
```
yarn run storybook
```
### Unit Tests
```
yarn run test
```
### Cypress E2E Tests
Only applies to `packages/snap-preact-demo`
```
yarn run cypress
```
### Build
Executes `yarn run build` across all packages sequentially. 
```
yarn run build
```
### Clean
Removes all package and root `node_modules` directories
```
yarn run clean
```
### Execute custom script in all packages
Executes package.json script across all packages
```
yarn workspaces run [command]
```

### Execute custom script in single package
Executes package.json script in specific package
```
yarn workspace [package] run [command]
```
Example: `yarn workspace @searchspring/snap-controller run test`