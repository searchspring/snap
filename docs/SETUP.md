# Setup


To create a new project, we recommend using the [Snapfu CLI](https://www.npmjs.com/package/snapfu) to initialize a new project from a preconfigured scaffold. 

Snapfu is a CLI interface for creating a Snap project from a template. You do not need to utilize Snapfu to develop using Snap, but it does simplify the process and provides additional features. 


## Install

Note: We recommend using Node v20 or higher and npm v10 or higher.

```sh
npm install -g snapfu
```


## Login

Snapfu will prompt you to authenticate with Github.

```sh
snapfu login
```

## Initialize new project

This will create a new project with git repo from a list of available scaffolds. 

During this you will also be propmpted for your Site ID and secret key, which you find in the [Searchspring Management Console](https://manage.searchspring.net)

```sh
snapfu init [projectname]
cd [projectname] && npm install && git checkout -b initial
```


## Development

```sh
npm run dev
```

This will start the local development server and serve the project build files and the contents of the `public` directory.

| File/Resource                | URL                                                      |
|------------------------------|----------------------------------------------------------|
| public/index.html            | [https://localhost:3333/](https://localhost:3333/)       |
| public/mockup.html (or other files) | [https://localhost:3333/mockup.html](https://localhost:3333/mockup.html) |
| main bundle                  | [https://localhost:3333/dist/bundle.js](https://localhost:3333/dist/bundle.js) |
| universal bundle             | [https://localhost:3333/dist/universal.bundle.js](https://localhost:3333/dist/universal.bundle.js) |

Note: The local server uses a self-signed certificate for HTTPS any you may be prompted to continue.


There are two common ways to develop a project, using a local mockup file and leveraging the Snapfu Chrome extension.

## Local mockup file

The preconfigured scaffold includes a `public/index.html` or `public/mockup.html` mockup file. These pages need to include a link to the local bundle file `bundle.js` in order for the local development server to serve the Snap bundle.

A minimal mockup file (shown below) contains only the necessary script and target elements to get components rendered on the page. More complete mockups would normally contain a copy of a storefront DOM structure and resources to inherit styles and fonts.

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

	<script src="bundle.js" id="searchspring-context"></script>
</html>
```


## Snapfu Chrome Extension

The Snapfu Chrome Extension is a Chrome extension that you can install manually via chrome developer mode. The extension allows you to inject the development `bundle.js` into a live storefront page. This is useful for previewing changes on a live domain.

Visit the website you are developing for, then click the extension to enable it and set the mode to `local`, then press `Save`.

The page will reload with the local development bundle [https://localhost:3333/dist/bundle.js](https://localhost:3333/dist/bundle.js) injected into the current website. While `npm run dev` is running, the page will automatically reload upon saving any code modifications.

For more information, see the [Snapfu Chrome Extension](https://github.com/searchspring/snapfu-extension) repository.



## Other Development Methods

Other possible but less desirable methods of serving the local development server while previewing changes on a live domain include:

- Browser local override modifying script src, typically requires an override per page
- Alternative development domain (e.g. `https://dev.mysite.com`) or unpublished storefront theme with script src pointing to `https://localhost:3333/dist/bundle.js` or a ngrok tunnel

