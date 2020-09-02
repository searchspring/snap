# Prerequisites:
- node >= 12
- npm >= 6
- SearchSpring Chrome Extension

# Install and authenticate snapfu
```sh
$ npm install -g snapfu
$ snapfu login
```

# Initialize new project

Run `snapfu init` in answer the prompts. 

You will be asked for your Site ID, which you can learn about [here]
When asked what framework, select Preact. 
When asked what template, select Custom.

This will create a new project with git repo.

Then run,

```sh
cd searchspring_integration_[your site id]
npm install # or yarn install
npm run dev
```

# Connect SearchSpring Chrome Extension to local dev server

Visit the website you are developing for. Pull down the extension set the mode to `local`. 

Open up `./components/index.js` 

Paste in:

```js
class HelloWorld {
	render() {
		return (
			<h1>Hello, Snapfu!</h1>
		);
	}
}

class MainContainer {
	render() {
		return (
			<div>
				<HelloWorld />
			</div>
		);
	}
}

module.exports = [
	{
		target: '#some_id .some_class',
		component: MainContainer
	}
];
```

The page should automatically update using live reload with your changes.

Note: It's considered best practice to have unique selectors for your components. For example, an element on your website:

```js
<div data-searchspring="main-container">
	...
```

With this as your target selector:
```js
{
	target: '[data-searchspring="main-container"]',
	component: MainContainer
}
```

# Deploy the bundle

```sh
$ git commit -am "Hello, snapfu"
$ git push
```

The bundle will automatically be built and deployed to this URL: `https://cdn.searchspring.net/snap/[your_site_id]/bundle.js`

You can now view this integration on your site from any Chrome browser with the SearchSpring extension with the following settings:

- Mode: production
- Site ID: [your_site_id]

You can also preview your work on a different branch with the following config:

- Mode: preview
- Site ID: [your_site_id]
- Branch: [your branch name]
