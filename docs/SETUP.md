## Setup


## Prerequisites

- npm v7

- node v14+

## Snapfu

_To follow the way of Snap - you must have strong Snap-fu._

Snapfu is a CLI interface for creating a Snap project from a template. You do not need to utilize Snapfu to develop using Snap packages, but it does simplify the process.

### Install

```sh
npm install -g snapfu
```


### Login

Snapfu will prompt you to authenticate with Github.

```sh
snapfu login
```

### Initialize new project

Initialize a new project using Snapfu:

```sh
snapfu init [projectname]
cd [projectname]
```

You will be asked for your Site ID, which you find in the [Searchspring Management Console](https://manage.searchspring.net)

Then select your desired framework, such as Preact. 

This will create a new project with git repo.

### Install project dependencies

```sh
npm install
```

## Development

After initializing a Snapfu project, it will contain a template ready for you to use. 

```sh
npm run dev
```

The local server will run at [https://localhost:3333](https://localhost:3333) and serves the contents of the `/public` directory as well as the project bundle files. The development bundle files are be served from [https://localhost:3333/bundle.js](https://localhost:3333/bundle.js).

Note: The local server uses a self-signed certificate for HTTPS, this will require adding a browser security exception for allowing the loading of these resources. There is a Chrome browser flag that can be set to prevent adding an exception: chrome://flags/#allow-insecure-localhost

Using Snapfu, there are two common ways to develop a project, using a local mockup file and leveraging the Snapfu Chrome extension.

### Local mockup

Creation of a local mockup file (for example, `index.html` or `mockup.html`) within the `/public` directory allows for the quickest development of a Snap integration. Mockup files can be created by copying the source files of particular pages that will contain the Snap integration - typically the search and category pages. These pages will need to include a link to the local bundle file (`bundle.js`) in order for the Snap bundle to run. A minimal mockup file (shown below) contains only the necessary script and target elements to get components rendered on the page. More complete mockups would normally contain DOM structure and links to website resources that would be present on the live site (CSS, etc...).

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8" />
		<title>Snap</title>
	</head>
	<body>
		<div id="searchspring-header"></div>
		<div id="searchspring-content"></div>
		<div id="searchspring-sidebar"></div>
	</body>

	<script src="dist/bundle.js"></script>
</html>
```

A `mockup.html` file within the `/public` directory is viewable at [https://localhost:3333/mockup.html](https://localhost:3333/mockup.html).

### Snapfu extension 

The Snapfu extension is a tool that can be used to test local changes on a live website. Visit the website you are developing for, then click the extension to enable it and set the mode to `local`, then press `Save`.

The page will reload with the local development bundle [https://localhost:3333/dist/bundle.js](https://localhost:3333/dist/bundle.js) injected into the current website. While `npm run dev` is running, the page will automatically reload upon saving any code modifications.

The Github repository for the [Snapfu extension](https://github.com/searchspring/snapfu-extension) has additional usage and installation documentation.
## Publishing

### Searchspring Managed Integration

When a Snap project resides within the [Searchspring Implementations Github organization](https://github.com/searchspring-implementations), the Snap bundle will automatically be built when the Snap (Github) action runs - this run is triggered by a Git push to the repository.

```sh
git commit -am "Hello, snapfu"
git push
```

Github action runs triggered on the `production` branch will build and deploy bundle files to this URL:

`https://snapui.searchspring.io/[your_site_id]/bundle.js`

Builds on different branch names will be deployed to:

`https://snapui.searchspring.io/[your_site_id]/[branch]/bundle.js`

### Self Integration (self-snap)

If you have opted to self integrate and use Snap you will need to host the build files yourself. If the URL above is used it will result in a 403 Error.

To host your own build files follow the below steps in your project.

1. Ensure you have changed directories so that you are in the parent directory of the project in your terminal
2. In your terminal run the command `npm run build`, will output build files to `./dist` 
3. Navigate to `./dist` and copy the generated build files 
4. Go to the codebase of your E-commerce platform (Shopify, Bigcommerce, Magento, etc.) and copy/paste the generated build files in a directory (most platforms have an ***assets*** directory) 
5. On the frontend of the site, add a script block as outlined in the [integration](https://github.com/searchspring/snap/blob/main/docs/INTEGRATION.md) section - be sure to change the `src` attribute to point to the `bundle.js` file and align the URL with your self-hosted build files (eg: /assets/bundle.js)
