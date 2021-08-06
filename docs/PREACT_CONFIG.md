## Snap Preact

The [@searchspring/snap-preact](@searchspring/snap-preact) package is an abstraction layer that provides a config based interface for creating a Searchspring integration quickly. Underneath the hood it utilizes all of the core Snap packages. If you wish to create a Snap integration using core packages individually, see the Advanced section.

If you are not using Snapfu to start with a template, you will need to start by adding Snap to your project.

```bash
npm install --save @searchspring/snap-preact
```

```typescript
import { Snap } from '@searchspring/snap-preact';
```


## Configuration

Lets define our config. The config that is provided to Snap will create and return all services that are specified in the config. In this example, we will be creating a Search and Autocomplete service.

```typescript
const config = {
	client: {
		globals: {
			siteId: 'xxxxxx',
		},
	},
	controllers: {
		search: [
			{
				config: {
					id: 'search',
				},
				targets: [
					{
						selector: '#searchspring-content',
						component: Content,
						hideTarget: true,
					},
					{
						selector: '#searchspring-sidebar',
						component: Sidebar,
						hideTarget: true,
					},
				],
			},
		],
		autocomplete: [
			{
				config: {
					id: 'autocomplete',
					selector: 'input.searchspring-ac',
					settings: {
						trending: {
							limit: 5,
						},
					},
				},
				targets: [
					{
						selector: 'input.searchspring-ac',
						component: Autocomplete,
						hideTarget: true,
					},
				],
			},
		],
	},
};
```

Lets go over a few things.

`config.client` is required and contains a config object that is passed to the core [@searchspring/snap-client](https://github.com/searchspring/snap/tree/main/packages/snap-client) package. This service handles the network requests that retrieve data to be displayed. At the bare minimum, `siteId` is required and can be obtained in the [Searchspring Management Console](https://manage.searchspring.net/)

`config.controllers` specifies all of the controllers that we wish to create. In this this example we are creating a Search and Autocomplete controller. In addition, Finder and Recommendation services can also be specified.

### Search

Lets look at the Search controller that we are creating.

The `config` object contains our controller configuration. The most notable property here is the required `id` with a given value of `'search'`. This will be the name of the controller that you will then interface from the return of creating the `new Snap()` instance via the `controllers` object. 

For example:

```typescript
const snap = new Snap(config)
const { search } = snap.controllers;
```

We also have a `targets` array of Target objects. A Target object defines an entry point on the page where a component will be rendered. 

`target.selector` specifies the DOM selector to target

`target.component` specifies a reference to the component to render at the target selector. 

`target.hideTarget` boolean that specifies if the target node should be hidden before the component is mounted and rendered. It is recommended to enable this to prevent flashy behaviour. 

In our example, we are rendering a `<Content>` component into `<div id="searchspring-content">` and the `<Sidebar>` component into `<div id="searchspring-sidebar">`


### Autocomplete

We're also creating an Autocomplete controller in a similar function.

One notable thing to mention as you may see a duplicate `selector` property in both the `config` and `target`

The `config.selector` specifies the `<input/>` element(s) to attach events to that respond to Autocomplete actions. This supports a selector that targets many elements. 

The `target.selector` specifies the DOM node where the `target.component` will be rendered into.

However in our example, since they are both the same value, the Autocomplete component will rendered as a child DOM node below the `<input/>` element that is currently focused. 

