# Setup

To follow the way of Snap - you must have strong Snap-fu.

## Snapfu

Snapfu is a cli interface for creating a Snap project from a template.

```sh
$ npm install -g snapfu
$ snapfu login

```

### Initialize new project

Initialize a new project using Snapfu:

```sh
$ mkdir [projectname]
$ cd [projectname]
$ snapfu init
```

You will be asked for your Site ID, which you find in the [Searchspring Management Console](https://manage.searchspring.net)

Then select your desired framework, such as Preact. 

This will create a new project with git repo.

Next install the packages:

```sh
npm install # or yarn install
```

## Development

After initializing a snapfu project, it will contain a template ready for you to use. 

```sh
npm run dev
```

The local server will run at [https://localhost:3333](https://localhost:3333)

You can use one of the following to display the bundle onto a page:

### Snapfu extension 

[Snapfu extension](https://github.com/searchspring/snapfu-extension-chrome)

Visit the website you are developing for. Pull down the extension set the mode to `local`. 
The snapfu extension will load the local bundle [https://localhost:3333/dist/bundle.js](https://localhost:3333/dist/bundle.js) onto the website you are developing for. 

The page should automatically update using live reload with your changes.

### Local mockup

A local `.html` file can be placed into the `/public` directory with the bundle linked:

```html
<script src="https://localhost:3333/dist/bundle.js"></script>
```

## Publishing

```sh
$ git commit -am "Hello, snapfu"
$ git push
```

The bundle will automatically be built from the `production` branch and deployed to this URL:

`https://snapui.searchspring.io/[your_site_id]/bundle.js`

Builds on different branch names will be deployed to:

`https://snapui.searchspring.io/[your_site_id]/[branch]/bundle.js`

You can now view this integration on your site from any Chrome browser using the SearchSpring extension.