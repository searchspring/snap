# Snap

All snap packages that are published to npm are found under the `/packages` directory

Npm workspaces is used to hoist package dependancies to the root `node_modules` directory, and link all packages together

Lerna is used to publish packages to npm, and to execute commands across the packages. See commands below or in the root `package.json`

## Prerequisite
### NPM v7.x
Npm v7.x is required for it's workspaces feature
Npm v7.7.0 is required for executing scripts in specific packages
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
### Execute custom script in all packages
Executes package.json script across all packages
```
npm run <command> --workspaces
```

### Execute custom script in single package
Executes package.json script in specific packages
```
npm run <command> [--workspace=<package> | -w <package>] [--workspace=<package> | -w <package>]
```