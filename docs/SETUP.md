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

The local server will run at [https://localhost:3333](https://localhost:3333) and serves the contents of the `/public` directory

The development bundle will be served from [https://localhost:3333/dist/bundle.js](https://localhost:3333/dist/bundle.js)

There are two ways we can develop and integration using the bundle:

### Snapfu extension 

[Snapfu extension](https://github.com/searchspring/snapfu-extension-chrome)

Visit the website you are developing for. Click the extension to enable it and set the mode to `local`, then press `Save`.

The page will reload and will load the local development bundle [https://localhost:3333/dist/bundle.js](https://localhost:3333/dist/bundle.js) onto the current website.

The page will automatically reload upon saving any code modifications while `npm run dev` is running.

### Local mockup

Alternatively, you can create a local mockup `index.html` file within the `/public` directory that includes the bundle linked. The mockup can then be viewed at [https://localhost:3333](https://localhost:3333)

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

## Publishing

```sh
git commit -am "Hello, snapfu"
git push
```

### Searchspring Integration

The bundle will automatically be built from the `production` branch and deployed to this URL:

`https://snapui.searchspring.io/[your_site_id]/bundle.js`

Builds on different branch names will be deployed to:

`https://snapui.searchspring.io/[your_site_id]/[branch]/bundle.js`

You can now view this integration on your site from any Chrome browser using the SearchSpring extension.

### Self Integration (self-snap)

If you have opted to self integrate and use snap you will need to host the bundle yourself. If the URL above is used it will result in a 403 Error.

To host your own bundle follow the below steps in your project.

1. Ensure you have changed directories so that you are in the parent directory of the project in your terminal
2. In your terminal run the command `npm run build`, will output bundle files to `./dist` 
3. Navigate to `./dist` and copy the generated bundle files 
4. Go to the codebase of your E-commerce platform (Shopify, Bigcommerce, Magento, etc.) and copy/paste the generated bundle files in a directory. Most platforms have an ***assets*** directory. 
5. On the frontend of the site, call the bundle files via a script. It is best practice to call these files in the `<head>` element to ensure the files load early in the overall page load

