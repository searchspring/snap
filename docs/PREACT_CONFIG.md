## Configuration

Lets define our config. The config that is provided to Snap will create and return controllers that are specified in the config. In this example, we will be creating a Search and Autocomplete controller.

```typescript
const config = {
	url: {
		parameters: {
			core: {
				query: { name: 'query' }
			}
		}
	},
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

`config.url` is optional and contains a [`UrlTranslator` config](https://github.com/searchspring/snap/tree/main/packages/snap-url-manager/src/Translators/Url) object that is passed to the core [@searchspring/snap-url-manager](https://github.com/searchspring/snap/tree/main/packages/snap-url-manager) package used by all controllers. This parameter configuration will be applied to all controllers created via Snap, but can be specified per controller for specific customization.

`config.client` is required and contains a config object that is passed to the core [@searchspring/snap-client](https://github.com/searchspring/snap/tree/main/packages/snap-client) package. This service handles the network requests to our APIs to retrieve data to be displayed.

`config.client.globals` specifies base query parameters to the API; these are parameters that will ALWAYS be included on every request. At the bare minimum, `siteId` is required and can be obtained in the [Searchspring Management Console](https://manage.searchspring.net/)

`config.controllers` specifies all of the controllers that we wish to create. In this this example we are creating a Search and Autocomplete controller. In addition, Finder and Recommendation services can also be specified.

### Search

Lets look at the Search controller that we are creating.

The `config` object contains our controller configuration. The most notable property here is the required `id` with a given value of `'search'`. This will be the name of the controller that can then be interfaced with the return of the `new Snap()` instance via the `controllers` object. 

For example:

```typescript
const snap = new Snap(config)
const { search } = snap.controllers;
```

We also have a `targets` array of Target objects. A Target object defines an entry point on the page where a component will be rendered. 

`target.selector` specifies the DOM selector to target

`target.component` specifies a reference to the component to render at the target selector. 

`target.hideTarget` boolean that specifies if the target node should be hidden before the component is mounted and rendered. It is recommended to enable this to prevent flashy behaviour. 

`target.props` (optional) convenient way of passing additional props to the component, by default we pass `controller`

`target.onTarget` (optional) callback that fires after a target is found

`target.name` (optional) name to give the targeter for later reference using `controller.targets`

In our example, we are rendering a `<Content>` component into `<div id="searchspring-content">` and the `<Sidebar>` component into `<div id="searchspring-sidebar">`



### Autocomplete

We're also creating an Autocomplete controller in a similar function.

One notable thing to mention as you may see a duplicate `selector` property in both the `config` and `target`.

The `config.selector` specifies the `<input/>` element(s) to attach events to that respond to Autocomplete actions. This supports a selector that targets many elements. 

The `target.selector` specifies the DOM node where the `target.component` will be rendered into.

However in our example, since they are both the same value, the Autocomplete component will rendered as a child DOM node below the `<input/>` element that is currently focused. 

