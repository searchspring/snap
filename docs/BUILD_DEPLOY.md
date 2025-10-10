# Building

To build the project, run the following command:

```sh
npm run build
```

The build output files are placed in the `dist` directory. Each project is configured to use Webpack to build the project files and will build two sets of files: A modern build and a universal build.

## Modern Build

The modern build is used for projects targeting the latest browsers supporting the latest JavaScript features (ES6 and above). Example modern build files: `bundle.js` & `bundle.chunk.[hash].js`

A browser is considered modern based on the [@searchspring/browserslist-config-snap modern](https://github.com/searchspring/browserslist-config-snap/blob/main/modern/index.js) rules and is included in the preconfigured scaffold.


## Universal Build

The universal build is used for projects targeting legacy browsers and will transpile any usage of modern JavaScript to ES5 as well as polyfill any missing browser features. If you are not targeting legacy browsers, you can omit deploying the universal built files that are prefixed with `universal.` - Example: `universal.bundle.js` and `universal.bundle.chunk.[hash].js`

A browser is considered legacy based on the [@searchspring/browserslist-config-snap universal](https://github.com/searchspring/browserslist-config-snap/blob/main/universal/index.js) rules and is included in the preconfigured scaffold.

However if you are targeting legacy browsers, it is not recommended to always serve the universal build files to all browsers - including modern browsers as this will impact web core vitals and performance negatively. 

Therefore you will require a method for switching the front-end script src to point to the appropriate version of the build files depending on if the browser is modern or legacy. This can be done many ways including:

- Server-side checking the userAgent and serving the appropriate version of the build files.
- Front-end checking the userAgent and serving the appropriate version of the build files.
- Lambda function serving the appropriate version of the build files based on the userAgent.

The following is an example of a regex that would match the versions of the `browserlist-config-snap@1.0.7` rules:

```js
module.exports = /((CPU[ +]OS|iPhone[ +]OS|CPU[ +]iPhone|CPU IPhone OS)[ +]+(14|(1[5-9]|[2-9]\d|\d{3,})|15|(1[6-9]|[2-9]\d|\d{3,}))[_.]\d+(?:[_.]\d+)?)|((?:Chrome).*OPR\/(77|(7[8-9]|[8-9]\d|\d{3,}))\.\d+\.\d+)|(Edge\/(91|(9[2-9]|\d{3,}))(?:\.\d+)?)|((Chromium|Chrome)\/(91|(9[2-9]|\d{3,}))\.\d+(?:\.\d+)?)|(Version\/(14|(1[5-9]|[2-9]\d|\d{3,})|15|(1[6-9]|[2-9]\d|\d{3,}))\.\d+(?:\.\d+)? Safari\/)|(Firefox\/(74|(7[5-9]|[8-9]\d|\d{3,}))\.\d+\.\d+)|(Firefox\/(74|(7[5-9]|[8-9]\d|\d{3,}))\.\d+(pre|[ab]\d+[a-z]*)?)/;
```
(regex generated using [browserslist-useragent-regexp](https://www.npmjs.com/package/browserslist-useragent-regexp))


## Deploying Self Integrated

If you are managing the project and repository (also referred to as "Self-Snap"), you will need handle the deployment of the build files to your CDN or hosting provider. (ie. Shopify, BigCommerce, Magento, AWS S3, etc..)

If the URL above is used it will result in a 403 Error.

To host your own build files follow the below steps in your project.

1. Ensure you have changed directories so that you are in the root of the project directory
2. In your terminal run the command `npm run build`, will output build files to `./dist` 
3. Navigate to `./dist` and copy the generated build files 
4. Go to the codebase of your E-commerce platform (Shopify, BigCommerce, Magento, etc.) and copy/paste the generated build files in a directory (most platforms have an ***assets*** directory) 
5. On the frontend of the site, add a script block as outlined in the [integration](https://searchspring.github.io/snap/build-deploy-integration) section - be sure to change the `src` attribute to point to the `bundle.js` file and align the URL with your self-hosted build files (eg: /assets/bundle.js)

<!-- TODO: Link to playform specific install docs and update here -->


## Deploying to Searchspring CDN

**Deploying to Searchspring CDN is only possible if the repository is managed by the Searchspring [Github organization](https://github.com/searchspring-implementations)**. Repositories in this organization are typically managed by the Searchspring professional services team and deployed via a CI/CD pipeline using the [snap-action](https://github.com/searchspring/snap-action) Github Action. An invitation can be requested for collaboration.

Github action runs triggered on the default branch `production` will build and deploy bundle files to this URL:

`https://snapui.searchspring.io/[your_site_id]/bundle.js`

Builds on different branch names will be deployed to:

`https://snapui.searchspring.io/[your_site_id]/[branch]/bundle.js`

### Github Repository Requirements

- Repository must be managed by the Searchspring [Github organization](https://github.com/searchspring-implementations)
- Repository must have a default branch named `production`
- Repository must have repository secrets for each siteId in the repository. Found at `https://github.com/[owner]/[repository]/settings/secrets/actions`
  - Secret Key Name: `WEBSITE_SECRET_KEY_[SITEID]` where `[SITEID]` is the siteId found in the [Searchspring Management Console](https://manage.searchspring.net). For example: `WEBSITE_SECRET_KEY_ABC123`
  - Value: `secretKey` located adjacent to the siteId in the [Searchspring Management Console](https://manage.searchspring.net)
- Repository must have a `snap-action` workflow file in the `.github/workflows` directory. See section below.
- Repository must have a `package.json` file that contains all siteIds associated with this project. See section below.

#### Github Action

The [snap-action](https://github.com/searchspring/snap-action/) can be used by creating a new github workflow file (ie. `.github/workflows/deploy.yml`)

The Snap Action requires additional parameters not shown in the example below. See [snap-action](https://github.com/searchspring/snap-action/) for additional documentation.

```yml
on: [push, pull_request]

jobs:
  Publish:
    runs-on: ubuntu-latest
    name: Snap Action
    steps:
      - name: Checkout action
        uses: actions/checkout@v2
        with:
          repository: searchspring/snap-action
      - name: Run @searchspring/snap-action
        uses: ./
```

#### Project package.json configuration

The package.json file must contain all siteIds associated with this project. This data is also used by the Snapfu CLI for various features.

<!-- TODO: Add Snapfu CLI docs and link here -->

Single siteId example: 

```json
{
    ...
    "searchspring": {
        "siteId": {
            "abc123": {
                "name": "site1.com"
            }
        },
    }
}
```

Multi siteId example: 

```json
{
    ...
    "searchspring": {
        "siteId": {
            "abc123": {
                "name": "site1.com"
            },
            "def456": {
                "name": "site1.com.au"
            }
        },
    }
}
```

### Branch Overrides

This functionality is only currently possible with Searchspring managed Snap repositories (https://github.com/searchspring-implementations).

While browsing a page that contains a Snap integration, appending the `?searchspring-preview=[branchname]` query parameter to the URL will stop the execution of the existing script, and load the build from the `[branchname]` branch `https://snapui.searchspring.io/[siteid]/[branchname]/bundle.js`

You will see an interface overlay on the bottom right of the viewport indicating if successful and details of the build.

<img src="https://github.com/searchspring/snap/blob/main/images/branch-override.png?raw=true" />

This will also be persisted across page navigation. To stop previewing a branch build, you must click the `Stop Preview` button in the interface or clear the `ssBranch` cookie. The interface can also be minimized. 


## Build Tools

Webpack is the default choice of build tooling that all Snapfu templates include and will be preconfigured.

If you are integrating `@searchspring/snap-preact` using other build tools, you may require certain plugins to ensure preact compatibility. 

We hope to maintain this page with the most common build tools and their respective plugins as we discover them. 


### Vite

[@preact/preset-vite](https://github.com/preactjs/presets/tree/main/packages/preset-vite) is a plugin for Vite that allows you to use Preact in your Vite project.

```js
// vite.config.js
import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [preact()],
})
```